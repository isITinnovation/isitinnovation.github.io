import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { popularTags, recentPosts } from "../../constants/menus";
import {
  SidebarContainer,
  SidebarSection,
  SectionTitle,
  TagList,
  TagItem,
  RecentPostList,
  RecentPostItem,
} from "./styles";

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <SidebarContainer>
      <SidebarSection>
        <SectionTitle>인기 태그</SectionTitle>
        <TagList>
          {popularTags.map((tag) => (
            <TagItem key={tag.id} onClick={() => navigate(tag.path)}>
              <Typography variant="body2">{tag.name}</Typography>
              {tag.count && (
                <Typography
                  variant="caption"
                  sx={{
                    ml: 1,
                    color: "grey.600",
                    fontWeight: 500,
                  }}
                >
                  {tag.count}
                </Typography>
              )}
            </TagItem>
          ))}
        </TagList>
      </SidebarSection>

      <SidebarSection>
        <SectionTitle>최근 업데이트</SectionTitle>
        <RecentPostList>
          {recentPosts.map((post) => (
            <RecentPostItem key={post.id} onClick={() => navigate(post.path)}>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                {post.title}
              </Typography>
              {post.date && (
                <Typography
                  variant="caption"
                  sx={{
                    color: "grey.600",
                    fontWeight: 500,
                  }}
                >
                  {post.date}
                </Typography>
              )}
            </RecentPostItem>
          ))}
        </RecentPostList>
      </SidebarSection>
    </SidebarContainer>
  );
};

export default Sidebar;
