/* eslint-disable camelcase */
const { uniq, find } = require('lodash');
const Testrail = require('testrail-api');
const ora = require('ora');
const logger = require('terminal-log');

const host = process.env.TESTRAIL_HOST || '';
const testrailUser = process.env.TESTRAIL_USER || '';
const testrailApikey = process.env.TESTRAIL_APIKEY || '';
const testrailSuiteName = 'Master';

const internalTestRail = new Testrail({
  host,
  user: testrailUser,
  password: testrailApikey,
});
  
const testrail = {
  getProjects: internalTestRail.getProjects.bind(internalTestRail),
  getSuites: internalTestRail.getSuites.bind(internalTestRail),
  getSuite: internalTestRail.getSuite.bind(internalTestRail),
  addSuite: internalTestRail.addSuite.bind(internalTestRail),
  getSections: internalTestRail.getSections.bind(internalTestRail),
  addSection: internalTestRail.addSection.bind(internalTestRail),
  getCases: internalTestRail.getCases.bind(internalTestRail),
  addCase: internalTestRail.addCase.bind(internalTestRail),
  updateCase: internalTestRail.updateCase.bind(internalTestRail),
  addRun: internalTestRail.addRun.bind(internalTestRail),
  addResultsForCases: internalTestRail.addResultsForCases.bind(internalTestRail),
  addProject: internalTestRail.addProject.bind(internalTestRail),
  closeRun: internalTestRail.closeRun.bind(internalTestRail),
  getRun: internalTestRail.getRun.bind(internalTestRail),
  getTests: internalTestRail.getTests.bind(internalTestRail),
};
  
const prepareResults = (testResults, suiteName) => {
  const testRailResults = {
    suite: {
      id: null,
      name: suiteName,
    },
    project: {
      id: null,
    },
    sections: [],
  };

  const tagRegex = /\s\[tag:.+\]/;
  uniq(testResults.map(x => x.section)).forEach(section => {
    testRailResults.sections.push({ id: null, name: section.replace(tagRegex, '').trim(), tests: [] });
  });

  testResults.forEach(test => {
    find(
      testRailResults.sections,
      section => section.name.trim() === test.section.replace(tagRegex, '').trim()
    ).tests.push({
      id: null,
      title: test.title.replace(tagRegex, '').trim(),
      status_id: test.skipped ? 2 : test.pass ? 1 : 5,
      comment: test.comment,
    });
  });

  return testRailResults;
};

const getRunTests = async (id) => {
  const { getTests } = testrail;
  const runTests = [];
  const size = 250;
  
  let offset = 0;
  let next = true;
  
  try {
    while (next) {
      const { body } = await getTests(id, { limit: size, offset });
      const { _links, tests } = body;
    
      if (_links && _links.next) {
        offset += size;
      } else {
        next = false;
      }
  
      runTests.push(...tests);
    }
  } catch (e) {
    logger.info(e);
  }
  return runTests;
};
  
const getProjectId = async (projectName) => {
  const { getProjects, addProject } = testrail;
  const { body: { projects } } = await getProjects();
  const exists = projects.find(({ name }) => name === projectName);
    
  if (exists && exists.id) {
    return exists.id;
  }
  
  const projectId = projects.length + 1;
  
  const { body } = await addProject(projectId, { name: projectName });
  
  return body.id;
};
  
const getSuiteId = async (mochaSuiteName, projectId) => {
  const { getSuites, addSuite } = testrail;
  const suites = await getSuites(projectId);
  
  const exists = suites.body.find(({ name }) => name === mochaSuiteName);
    
  if (exists && exists.id) {
    return exists.id;
  }
  
  const { body } = await addSuite(projectId, { name: testrailSuiteName });
  
  return body.id;
};
  
const getSectionId = async (suite, project, mochaSectionName) => {
  const { addSection, getSections } = testrail;
  const { body: { sections } } = await getSections(project.id, { suite_id: suite.id });
  const exists = sections.find(({ name }) => name === mochaSectionName);
  
  if (exists && exists.id) {
    return exists.id;
  }
  
  const { body } = await addSection(project.id, {
    suite_id: suite.id,
    name: mochaSectionName,
  });
  
  return body.id;
};
  
const getAllSectionIds = async ({ suite, project, sections }) => {
  const results = [];
  
  for (const { name, tests } of sections) {
    try {
      const sectionId = await getSectionId(suite, project, name);
  
      results.push({
        id: sectionId,
        name,
        tests,
      });
    } catch (e) {
      logger.info(e);
    }
  }
  
  return results;
};
  
const getTestId = async (suite, project, section, mochaTestTitle) => {
  const { getCases, addCase, updateCase } = testrail;
  const { body: { cases } } = await getCases(project.id, { suite_id: suite.id, section_id: section.id });
  
  const exists = cases.find(
    ({ title, id }) =>
      title.trim() === mochaTestTitle.trim() ||
        mochaTestTitle.trim().includes(`C${id}`)
  );
  
  if (exists && (!exists.custom_auto_integration)) {
    await updateCase(exists.id, {
      custom_auto_integration: 4,
      custom_automation_type: 1,
      custom_cpe_test_type: 3,
    });
  }
  
  if (exists && exists.id) {
    return exists.id;
  }
  
  const { body } = await addCase(section.id, {
    title: mochaTestTitle,
    custom_automation_type: 1,
    custom_auto_integration: 4,
    custom_cpe_test_type: 3,
  });
  return body.id;
};
  
const getAllTestIdsForSection = async (suite, project, section) => {
  const results = [];
  
  for (const { title, status_id, comment, test_type } of section.tests) {
    try {
      const testId = await getTestId(suite, project, section, title, test_type);
  
      results.push({
        id: testId,
        title,
        status_id,
        ...(comment ? { comment } : null),
      });
    } catch (e) {
      logger.info(e);
    }
  }
  
  return results;
};
  
const getAllTestIds = async ({ suite, project, sections }) => {
  const results = [];
  
  for (const section of sections) {
    try {
      const tests = await getAllTestIdsForSection(suite, project, section);
  
      results.push({
        id: section.id,
        name: section.name,
        tests,
      });
    } catch (e) {
      logger.info(e);
    }
  }
  
  return results;
};
  
const flattenTestIds = (sections) => {
  return sections.map(
    (section) => {
      return section.tests.map(
        (test) => {
          return test.id;
        }
      );
    }
  ).flat();
};
  
const publishResultsToTestRail = (testResults, projectName) => {
  const testRailResults = { ...testResults };
  const spinner = ora('Publish results to testrail ...', '\n');
  
  getProjectId(projectName)
    .then(projectId => {
      spinner.start();
      testRailResults.project.id = projectId;
      return getSuiteId(testrailSuiteName, projectId);
    })
    .then(suiteId => {
      testRailResults.suite.id = suiteId;
      return getAllSectionIds(testRailResults);
    })
    .then(sections => {
      testRailResults.sections = sections;
      return getAllTestIds(testRailResults);
    })
    .then(sections => {
      const { addRun } = testrail;
      testRailResults.sections = sections;
      
      return addRun(
        testRailResults.project.id, {
          suite_id: testRailResults.suite.id,
          name: `${testRailResults.suite.name} automated test run created ${new Date().toISOString()}`,
          case_ids: flattenTestIds(sections),
          include_all: false,
        });
    })
    .then(run => {
      const { addResultsForCases, closeRun } = testrail;
  
      const results = [];
  
      testRailResults.sections.forEach(section => {
        section.tests.forEach(test => {
          results.push({
            case_id: test.id,
            status_id: test.status_id,
            comment: test.comment,
          });
        });
      });
  
      const addResults = addResultsForCases(
        run.body.id,
        results
      );
      spinner.succeed(`Test Run: https://myfox.testrail.io/index.php?/runs/view/${run.body.id}`);
      // eslint-disable-next-line no-unused-expressions
      addResults;
  
      return closeRun(run.body.id);
    })
  // eslint-disable-next-line no-console
    .then(() => console.log('Finished publishing'))
    .catch(err => {
      spinner.fail(err.message);
      logger.info(err.message);
    });
};
  
const publishResultsToRun = (testResults, runId) => {
  const testRailResults = { ...testResults };
  const spinner = ora('Publish results to testrail run ...', '\n');
  
  getRunTests(runId)
    .then(runTests => {
      spinner.start();
  
      const { addResultsForCases } = testrail;
      const { sections } = testRailResults;
      
      const results = [];
      sections.forEach(({ tests }) => {
        tests.forEach(test => {
          const isRunTest = runTests.find(({ title, case_id }) => title === test.title || test.title.includes(`C${case_id}`));
            
          if (isRunTest) {
            results.push({
              case_id: isRunTest.case_id,
              status_id: test.status_id,
              comment: test.comment,
            });
          }
        });
      });
  
      return addResultsForCases(
        runId,
        results
      );
    })
    .then(() => spinner.succeed(`Test Run: https://myfox.testrail.io/index.php?/runs/view/${runId}`))
    .catch(err => {
      spinner.fail(err.message);
      logger.info(err.message);
    });
};

module.exports = {
  prepareResults,
  publishResultsToTestRail,
  publishResultsToRun,
};
