/**
 * AI 评论审核工具 (基于 DeepSeek API)
 */
export class AIModerator {
    private static API_URL = "https://api.deepseek.com/v1/chat/completions";
    private static API_KEY = process.env.DEEPSEEK_API_KEY;

    /**
     * 调用 AI 审核评论内容
     * @param content 评论内容
     * @returns 'approved' | 'spam'
     */
    static async moderate(content: string): Promise<"approved" | "spam"> {
        if (!this.API_KEY) {
            console.warn("AI_MODERATOR: DEEPSEEK_API_KEY is not set. Skipping AI moderation.");
            return "approved"; // 如果没配置 Key，默认通过以防业务中断
        }

        try {
            const response = await fetch(this.API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.API_KEY}`
                },
                body: JSON.stringify({
                    model: "deepseek-chat",
                    messages: [
                        {
                            role: "system",
                            content: "你是一个博客评论审核员。请分析接下来的评论内容。如果是友好、相关、正常的评论，请回复 'approved'；如果是广告、刷屏、无意义内容，或者辱骂、色情、违法、极度冒犯的内容，请回复 'spam'。只需回复这两个单词中的一个，不要有任何多余文字。"
                        },
                        {
                            role: "user",
                            content: content
                        }
                    ],
                    temperature: 0.3
                })
            });

            const data = await response.json();
            const result = data.choices[0].message.content.trim().toLowerCase();

            if (result.includes("approved")) return "approved";
            return "spam"; // 默认不通过
        } catch (error) {
            console.error("AI_MODERATOR_ERROR:", error);
            return "approved"; // 接口异常时默认通过，等待人工二次确认
        }
    }
}
