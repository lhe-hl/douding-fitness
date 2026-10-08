import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 开始初始化测试用户数据...');

  const testUser = await prisma.user.upsert({
    where: { openid: 'mock_openid_test_001' },
    update: {},
    create: {
      id: 'test-user-001',
      openid: 'mock_openid_test_001',
      nickname: '豆丁铁粉',
      avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=douding',
      gender: 1, // 男
      height: 175.0,
      weight: 72.5,
      targetWeight: 68.0,
    },
  });

  console.log('✅ 测试用户初始化成功:', testUser);
}

main()
  .catch((e) => {
    console.error('❌ 初始化数据失败:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
