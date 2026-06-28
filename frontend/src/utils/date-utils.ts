import { siteConfig, SITE_TIMEZONE } from "../config";

export function formatDateToYYYYMMDD(date: Date): string {
	return date.toISOString().substring(0, 10);
}

// 国际化日期格式化函数
export function formatDateI18n(dateString: string): string {
	const date = new Date(dateString);
	const lang = siteConfig.lang || "en";

	// 根据语言设置不同的日期格式
	const options: Intl.DateTimeFormatOptions = {
		year: "numeric",
		month: "long",
		day: "numeric",
	};

	// 语言代码映射
	const localeMap: Record<string, string> = {
		zh_CN: "zh-CN",
		zh_TW: "zh-TW",
		en: "en-US",
		ja: "ja-JP",
		ko: "ko-KR",
		es: "es-ES",
		th: "th-TH",
		vi: "vi-VN",
		tr: "tr-TR",
		id: "id-ID",
		fr: "fr-FR",
		de: "de-DE",
		ru: "ru-RU",
		ar: "ar-SA",
	};

	const locale = localeMap[lang] || "en-US";
	return date.toLocaleDateString(locale, options);
}

// 解析带或不带时区的时间字符串，为其补充站点默认时区
export function parseDateWithSiteTimezone(dateString: string): Date {
	let normalizedDate = dateString.trim();
	// 如果包含空格且不包含 T，将其替换为 T 以符合 ISO 标准
	if (normalizedDate.includes(" ") && !normalizedDate.includes("T")) {
		normalizedDate = normalizedDate.replace(" ", "T");
	}

	// 如果不包含时区信息（如结尾没有 Z，也没有类似 +08:00 的偏移量），则为其补充站点默认时区
	if (!/(Z|[+-]\d{2}:\d{2})$/.test(normalizedDate)) {
		const tzOffset = SITE_TIMEZONE;
		const sign = tzOffset >= 0 ? "+" : "-";
		const absOffset = Math.abs(tzOffset);
		const hours = Math.floor(absOffset).toString().padStart(2, "0");
		const minutes = ((absOffset % 1) * 60).toString().padStart(2, "0");
		const timezoneStr = `${sign}${hours}:${minutes}`;
		normalizedDate += timezoneStr;
	}

	return new Date(normalizedDate);
}
