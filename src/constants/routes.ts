interface Route {
  name: string;
  path: string;
  icon?: React.ReactNode;
}

export const ROUTES: Route[] = [
  {
    name: "홈",
    path: "/isITinnovation",
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
