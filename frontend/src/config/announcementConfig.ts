import type { AnnouncementConfig } from "../types/config";

// 公告栏配置
export const announcementConfig: AnnouncementConfig = {
	title: "", // 公告标题，填空使用i18n字符串Key.announcement
	content: "绝赞建设中...<br>测试换行", // 公告内容    // 支持html标签
	closable: false, // 允许用户关闭公告
	link: {
		enable: false, // 启用链接
		text: "查看更多", // 链接文本
		url: "/about/", // 链接 URL
		external: false, // 内部链接
	},
};
