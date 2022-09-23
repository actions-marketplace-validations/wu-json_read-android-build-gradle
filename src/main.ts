import * as core from '@actions/core';
import * as fs from 'fs';

process.on('unhandledRejection', handleError)
main().catch(handleError)

function getBooleanInput(inputName: string, defaultValue: boolean = false): boolean {
  return (core.getInput(inputName) || String(defaultValue)).toUpperCase() === 'TRUE';
}

function setOutput(key: string, value: string) {
  core.setOutput(key, value);
};

function getVersionCode(content: string): any {
  let versionCode;
  const codeMatches = content.match(/(versionCode [\d]*)/is);
  if (codeMatches) {
    const codeParts = codeMatches[0].split(" ");
    versionCode = codeParts[codeParts.length - 1]
  }
  return versionCode;
}

function getVersionName(content: string): any {

  let versionName;
  const nameMatches = content.match(/(versionName "[\s\S]*?")/is);

  if (nameMatches) {
    const nameParts = nameMatches[0].split("\"");
    versionName = nameParts[1];
  }
  return versionName;
}

function failWithMessage(message: string) {
  core.setFailed(message);
  process.exit(1);
}

async function main(): Promise<void> {
  try {
    let buildGradlePath = core.getInput('path');
    let shouldExposeCode = getBooleanInput('expose-version-code');
    let shouldExposeName = getBooleanInput('expose-version-name');

    if (!fs.existsSync(buildGradlePath)) {
      failWithMessage(`The file path for the build.gradle does not exist or is not found: ${buildGradlePath}`);
    }

    let fileContent = fs.readFileSync(buildGradlePath).toString();
    fs.chmodSync(buildGradlePath, "600");

    if (shouldExposeCode) {
      let code = getVersionCode(fileContent);
      if (code != null) {
        setOutput('android-version-code', code);
        core.info(`Set android-version-code to this value: ${code}.`);
      } else {
        failWithMessage('Version code could not be found in the file');

      }
    }

    if (shouldExposeName) {
      let name = getVersionName(fileContent);
      if (name != null) {
        setOutput('android-version-name', name);
        core.info(`Set android-version-name to this value: ${name}.`);
      } else {
        failWithMessage('Version name could not be found in the file');
      }
    }

  } catch (error) {
    if (error instanceof Error) {
          core.setFailed(error.message);
    }
    failWithMessage(`Unknown error: ${error}`);
  }
}

function handleError(err: any): void {
  console.error(err)
  core.setFailed(`Unhandled error: ${err}`)
}
