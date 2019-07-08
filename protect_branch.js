const fs = require('fs')
const gitBranchFile = './.git/HEAD'
const protectBranchs = ['master', 'dev']
const regExp = new RegExp(`refs/heads/(${protectBranchs.join('|')})\\b`)
let gitBranchInfo = fs.readFileSync(gitBranchFile, 'utf8')
// console.log(gitBranchInfo)
// console.log(regExp)
let isProtectBranch = regExp.test(gitBranchInfo)
// console.log(isProtectBranch)
console.log('提交不规范，回退泪纵横')
console.log('受保护的分支：', protectBranchs, '！请先新建分支，然后通过 pull requests 提交您的代码 & 备注您的代码解决的相关问题！')
// 1:终止
process.exit(isProtectBranch)


