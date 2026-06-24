import type { FooterConfig } from "../types/config";

// 页脚配置
export const footerConfig: FooterConfig = {
	enable: true, // 是否启用Footer HTML注入功能
	customHtml:
        "<div style=\"display: flex; align-items: center; justify-content: center; gap: 6px; flex-wrap: wrap;\">" +
        "<img src=\"/assets/registration-icon/icon.png\" style=\"width: 12px; height: 12px; vertical-align: center; margin-bottom: 3px;\" alt=\"icon\">" +
        "<a href=\"https://beian.mps.gov.cn/#/query/webSearch?code=33019202003078\" rel=\"noreferrer\" target=\"_blank\">浙公网安备33019202003078号</a>" +
        "<a href=\"https://beian.miit.gov.cn/#/Integrated/index\" rel=\"noreferrer\" target=\"_blank\">浙ICP备2026043084号-1</a>" +
        "</div>", // HTML格式的自定义页脚信息，例如备案号等，默认留空
	// 也可以直接编辑 FooterConfig.html 文件来添加备案号等自定义内容
	// 注意：若 customHtml 不为空，则使用 customHtml 中的内容；若 customHtml 留空，则使用 FooterConfig.html 文件中的内容
	// FooterConfig.html 可能会在未来的某个版本弃用
};
