import type { Song } from "./types";

export const STORAGE_KEY_VOLUME = "music-player-volume";

export const DEFAULT_VOLUME = 0.7;

export const LOCAL_PLAYLIST: Song[] = [
	{
		id: 1,
		title: "Flicker",
		artist: "Andora,RANASOL",
		cover: "assets/music/cover/Andora,RANASOL - Flicker.webp",
		url: "assets/music/url/Andora,RANASOL - Flicker.mp3",
		duration: 0,
	},
	{
		id: 2,
		title: "Ave Mujica",
		artist: "Ave Mujica",
		cover: "assets/music/cover/Ave Mujica - Ave Mujica.webp",
		url: "assets/music/url/Ave Mujica - Ave Mujica.mp3",
		duration: 0,
	},
	{
		id: 3,
		title: "アディオス",
		artist: "DAZBEE",
		cover: "assets/music/cover/DAZBEE - アディオス.webp",
		url: "assets/music/url/DAZBEE - アディオス.mp3",
		duration: 0,
	},
	{
		id: 4,
		title: "迷星叫 (パラレルver.)",
		artist: "あこがれの共演,戸山 香澄,美竹 蘭",
		cover: "assets/music/cover/あこがれの共演,戸山 香澄,美竹 蘭 - 迷星叫 (パラレルver.).webp",
		url: "assets/music/url/あこがれの共演,戸山 香澄,美竹 蘭 - 迷星叫 (パラレルver.).mp3",
		duration: 0,
	},
	{
		id: 5,
		title: "MILABO",
		artist: "ずっと真夜中でいいのに。",
		cover: "assets/music/cover/ずっと真夜中でいいのに。 - MILABO.webp",
		url: "assets/music/url/ずっと真夜中でいいのに。 - MILABO.mp3",
		duration: 0,
	},
	{
		id: 6,
		title: "あいつら全員同窓会",
		artist: "ずっと真夜中でいいのに。",
		cover: "assets/music/cover/ずっと真夜中でいいのに。 - あいつら全員同窓会.webp",
		url: "assets/music/url/ずっと真夜中でいいのに。 - あいつら全員同窓会.mp3",
		duration: 0,
	},
	{
		id: 7,
		title: "お勉強しといてよ",
		artist: "ずっと真夜中でいいのに。",
		cover: "assets/music/cover/ずっと真夜中でいいのに。 - お勉強しといてよ.webp",
		url: "assets/music/url/ずっと真夜中でいいのに。 - お勉強しといてよ.mp3",
		duration: 0,
	},
	{
		id: 8,
		title: "消えてしまいそうです",
		artist: "ずっと真夜中でいいのに。",
		cover: "assets/music/cover/ずっと真夜中でいいのに。 - 消えてしまいそうです.webp",
		url: "assets/music/url/ずっと真夜中でいいのに。 - 消えてしまいそうです.mp3",
		duration: 0,
	},
	{
		id: 9,
		title: "猫リセット",
		artist: "ずっと真夜中でいいのに。",
		cover: "assets/music/cover/ずっと真夜中でいいのに。 - 猫リセット.webp",
		url: "assets/music/url/ずっと真夜中でいいのに。 - 猫リセット.mp3",
		duration: 0,
	},
	{
		id: 10,
		title: "ただ君に晴れ",
		artist: "ヨルシカ",
		cover: "assets/music/cover/ヨルシカ - ただ君に晴れ.webp",
		url: "assets/music/url/ヨルシカ - ただ君に晴れ.mp3",
		duration: 0,
	},
	{
		id: 11,
		title: "又三郎",
		artist: "ヨルシカ",
		cover: "assets/music/cover/ヨルシカ - 又三郎.webp",
		url: "assets/music/url/ヨルシカ - 又三郎.mp3",
		duration: 0,
	},
	{
		id: 12,
		title: "晴る",
		artist: "ヨルシカ",
		cover: "assets/music/cover/ヨルシカ - 晴る.webp",
		url: "assets/music/url/ヨルシカ - 晴る.mp3",
		duration: 0,
	},
	{
		id: 13,
		title: "言って。",
		artist: "ヨルシカ",
		cover: "assets/music/cover/ヨルシカ - 言って。.webp",
		url: "assets/music/url/ヨルシカ - 言って。.mp3",
		duration: 0,
	},
	{
		id: 14,
		title: "ギターと孤独と蒼い惑星",
		artist: "結束バンド",
		cover: "assets/music/cover/結束バンド - ギターと孤独と蒼い惑星.webp",
		url: "assets/music/url/結束バンド - ギターと孤独と蒼い惑星.mp3",
		duration: 0,
	},
	{
		id: 15,
		title: "ラブソングが歌えない",
		artist: "結束バンド",
		cover: "assets/music/cover/結束バンド - ラブソングが歌えない.webp",
		url: "assets/music/url/結束バンド - ラブソングが歌えない.mp3",
		duration: 0,
	},
	{
		id: 16,
		title: "光の中へ",
		artist: "結束バンド",
		cover: "assets/music/cover/結束バンド - 光の中へ.webp",
		url: "assets/music/url/結束バンド - 光の中へ.mp3",
		duration: 0,
	},
	{
		id: 17,
		title: "青春コンプレックス",
		artist: "結束バンド",
		cover: "assets/music/cover/結束バンド - 青春コンプレックス.webp",
		url: "assets/music/url/結束バンド - 青春コンプレックス.mp3",
		duration: 0,
	},
];

export const DEFAULT_SONG: Song = {
	title: "Sample Song",
	artist: "Sample Artist",
	cover: "/favicon/favicon.ico",
	url: "",
	duration: 0,
	id: 0,
};

export const DEFAULT_METING_API =
	"https://www.bilibili.uno/api?server=:server&type=:type&id=:id&auth=:auth&r=:r";
export const DEFAULT_METING_ID = "14164869977";
export const DEFAULT_METING_SERVER = "netease";
export const DEFAULT_METING_TYPE = "playlist";

export const ERROR_DISPLAY_DURATION = 3000;
export const SKIP_ERROR_DELAY = 1000;
