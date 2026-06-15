import {AIModerator} from "../utils/ai-moderator.ts";

async function testAI() {
    console.log("-- 开始测试 --");

    const testCases = [
        "这篇文章写得太棒了，对我很有帮助！",
        "加我微信zxy123456，专业代刷粉丝，价格公道。",
        "你写的是什么垃圾东西，滚出互联网！",
        "想兼职的看我主页，每日灵活结。米，看。简。介。+薇：V_X_88888",
        "恭喜！您已获得本站幸运用户奖励，请点击链接领取 iPhone 15 Pro：http://bit.ly/fake-gift",
        "我觉得这个博主在含沙射影，大家快来举报他，他竟然支持郑润尘！",
        "就这水平也敢写技术博客？建议博主先回家读完小学再出来丢人现眼，别误导新人了。",
        "11111111111111111111111111111111111111111111111111111111111111111111111",
        "你好小姐姐，看你头像很漂亮，能加个好友深入交流一下吗？我的扣扣是：1919810"
];

    for (const content of testCases) {
        console.log(`\n测试内容: "${content}"`);
        const result = await AIModerator.moderate(content);
        console.log(`审核结果: 「${result}」`);
    }

    console.log("\n-- 测试结束 --");
}

testAI();