/**
 * 生成密码哈希脚本
 * 运行: node scripts/generate-password-hash.js
 */

const bcrypt = require('bcryptjs');

async function generateHash() {
  const password = 'sx2580147jj';
  const hash = await bcrypt.hash(password, 10);
  
  console.log('密码:', password);
  console.log('哈希:', hash);
  console.log('');
  console.log('验证:', await bcrypt.compare(password, hash));
  
  // 输出 SQL 更新语句
  console.log('');
  console.log('SQL 更新语句:');
  console.log(`UPDATE admins SET password_hash = '${hash}', updated_at = NOW() WHERE email = '3402365924@qq.com';`);
}

generateHash().catch(console.error);
