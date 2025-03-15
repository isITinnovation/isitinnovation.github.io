interface Route {
  name: string;
  path: string;
  icon?: React.ReactNode;
}

export const ROUTES: Route[] = [
  {
    name: "실시간 인기 게시글",
    path: "/isITinnovation",
  },
  {
    name: "주식트렌드 ",
    path: "/stock-trend",
  },
  // {
  //   name: "프롬프트",
  //   path: "/prompt-guide",
  // },
  {
    name: "소개",
    path: "/about",
  },
];
