interface RouteItem {
  name: string;
  path: string;
  icon?: string; // 나중에 아이콘을 추가할 수 있도록 준비
}

export const ROUTES: RouteItem[] = [
  {
    name: "홈",
    path: "/",
  },
  {
    name: "트렌드",
    path: "/trending",
  },
  {
    name: "프롬프트",
    path: "/prompt-guide",
  },
  {
    name: "소개",
    path: "/about",
  },
];
