const rp = require('request-promise');
const OWNER = 'cjh804263197';
const REPO = 'electron-hot-update-release';
const jhToken = 'a31971df8158875f01365e17924cd4f8f549765d';
const REPOS_TOKEN = jhToken;
const fs = require('fs');

// https://developer.github.com/v3/repos/releases/
async function getLatestRelease() {
  const requestOptions = {
    method: 'GET',
    uri: `https://api.github.com/repos/${OWNER}/${REPO}/releases/latest`,
    headers: { 'User-Agent': 'Request-Promise' },
    json: true,
  };
  const response = await rp(requestOptions);
  return response;
}

async function deleteRelease(releaseId) {
  const requestOptions = {
    method: 'DELETE',
    uri: `https://api.github.com/repos/${OWNER}/${REPO}/releases/${releaseId}?access_token=${REPOS_TOKEN}`,
    headers: { 'User-Agent': 'Request-Promise' },
    json: true,
  };
  const response = await rp(requestOptions);
  return response;
}

async function createRelease(tagName, targetCommitish, name, body) {
  const postData = {
    tag_name: tagName,
    target_commitish: targetCommitish,
    name,
    body,
    draft: false,
    prerelease: false,
  };
  const requestOptions = {
    method: 'POST',
    uri: `https://api.github.com/repos/${OWNER}/${REPO}/releases?access_token=${REPOS_TOKEN}`,
    headers: { 'User-Agent': 'Request-Promise' },
    json: true,
    body: postData,
  };
  const response = await rp(requestOptions);
  return response;
}

async function editRelease(releaseId) {
  const postData = {
    tag_name: '1.0.2',
    target_commitish: 'master',
    name: '1.0.2',
    body: 'Description of the release',
    draft: false,
    prerelease: false,
  };
  const requestOptions = {
    method: 'PATCH',
    uri: `https://api.github.com/repos/${OWNER}/${REPO}/releases/${releaseId}?access_token=${REPOS_TOKEN}`,
    headers: { 'User-Agent': 'Request-Promise' },
    json: true,
    body: postData,
  };
  const response = await rp(requestOptions);
  return response;
}

async function getReleaseAssets(releaseId) {
  const requestOptions = {
    method: 'GET',
    uri: `https://api.github.com/repos/${OWNER}/${REPO}/releases/${releaseId}/assets?access_token=${REPOS_TOKEN}`,
    headers: { 'User-Agent': 'Request-Promise' },
    json: true,
  };
  const response = await rp(requestOptions);
  return response;
}

async function uploadReleaseAsset(releaseId, name, buffer) {
  const requestOptions = {
    method: 'POST',
    uri: `https://uploads.github.com/repos/${OWNER}/${REPO}/releases/${releaseId}/assets?access_token=${REPOS_TOKEN}&name=${name}`,
    headers: { 'User-Agent': 'Request-Promise', 'Content-Type': 'application/zip' },
    body: buffer,
  };
  const response = await rp(requestOptions);
  return response;
}

async function getSingleReleaseAsset(assetId) {
  const requestOptions = {
    method: 'GET',
    uri: `https://api.github.com/repos/${OWNER}/${REPO}/releases/assets/${assetId}?access_token=${REPOS_TOKEN}`,
    headers: { 'User-Agent': 'Request-Promise' },
    json: true,
  };
  const response = await rp(requestOptions);
  return response;
}

async function deleteReleaseAssect(assetId) {
  const requestOptions = {
    method: 'DELETE',
    uri: `https://api.github.com/repos/${OWNER}/${REPO}/releases/assets/${assetId}?access_token=${REPOS_TOKEN}`,
    headers: { 'User-Agent': 'Request-Promise' },
    json: true,
  };
  const response = await rp(requestOptions);
  return response;
}

async function testGithubRelease() {
  try {
    console.log('testGithubRelease');
    let rsp = null;
    const latestReleaseRsp = await getLatestRelease();
    const version = latestReleaseRsp.tag_name;
    const releaseId = latestReleaseRsp.id;
    console.log('Lates Release version:', version, ',', 'Release id:', releaseId);
    // rsp = await deleteRelease(releaseId);
    // rsp = await createRelease('1.0.2', 'master', '1.0.2', 'Description of the release');
    const btf = fs.readFileSync('/Users/apple/KIWI/test/electron-update-demo/bundle.zip');
    rsp = await uploadReleaseAsset(releaseId, 'b.zip', btf);
    const latestReleaseAssetsRsp = await getReleaseAssets(releaseId);
    console.log('latestReleaseAssetsId', latestReleaseAssetsRsp && latestReleaseAssetsRsp.map(item => item.id));
    // rsp = await deleteReleaseAssect(18516645);
    // rsp = await getSingleReleaseAsset(18517330);
    console.log('rsp', rsp);
  } catch (error) {
    console.log('error', error.message);
  }
}

export default testGithubRelease;

export { testGithubRelease };
