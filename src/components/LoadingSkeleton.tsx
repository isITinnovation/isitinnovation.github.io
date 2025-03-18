import React from "react";
import { Skeleton, Box, Container, Typography } from "@mui/material";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import dogAnimation from "@assets/animations/dog.json";
import dog2Animation from "@assets/animations/dog2.json";
import "./LoadingSkeleton.css";

// Lottie 애니메이션 타입 정의
type LottieAnimation = {
  v: string;
  fr: number;
  ip: number;
  op: number;
  w: number;
  h: number;
  layers: any[];
};

interface LoadingSkeletonProps {
  title?: string;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ title }) => {
  return (
    <Container maxWidth="lg" sx={{ mt: 8, mb: 4 }}>
      {title && (
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Typography
              variant="h5"
              sx={{
                color: "#000000",
                fontWeight: "bold",
                mb: 2,
              }}
            >
              {title}
            </Typography>
          </motion.div>
        </Box>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ mb: 4, position: "relative" }}>
          <Box className="running-dog">
            <Lottie
              animationData={dogAnimation as LottieAnimation}
              loop={true}
              style={{ width: 90, height: 90 }}
              autoplay={true}
            />
          </Box>
          <Box className="running-dog2">
            <Lottie
              animationData={dog2Animation as LottieAnimation}
              loop={true}
              style={{ width: 120, height: 120 }}
              autoplay={true}
            />
          </Box>
          <Skeleton
            variant="rectangular"
            height={60}
            sx={{
              borderRadius: 2,
              mb: 2,
              background:
                "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 1.5s infinite",
              "@keyframes shimmer": {
                "0%": { backgroundPosition: "200% 0" },
                "100%": { backgroundPosition: "-200% 0" },
              },
            }}
          />
          <Skeleton
            variant="text"
            height={40}
            sx={{
              width: "60%",
              mb: 2,
              background:
                "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 1.5s infinite",
              "@keyframes shimmer": {
                "0%": { backgroundPosition: "200% 0" },
                "100%": { backgroundPosition: "-200% 0" },
              },
            }}
          />
          <Skeleton
            variant="text"
            height={30}
            sx={{
              width: "40%",
              mb: 4,
              background:
                "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 1.5s infinite",
              "@keyframes shimmer": {
                "0%": { backgroundPosition: "200% 0" },
                "100%": { backgroundPosition: "-200% 0" },
              },
            }}
          />
        </Box>

        <Box sx={{ mb: 4 }}>
          <Skeleton
            variant="rectangular"
            height={300}
            sx={{
              borderRadius: 2,
              mb: 2,
              background:
                "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 1.5s infinite",
              "@keyframes shimmer": {
                "0%": { backgroundPosition: "200% 0" },
                "100%": { backgroundPosition: "-200% 0" },
              },
            }}
          />
        </Box>

        <Box>
          {[1, 2, 3, 4, 5].map((index) => (
            <Skeleton
              key={index}
              variant="text"
              height={24}
              sx={{
                width: "100%",
                mb: 1,
                background:
                  "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
                backgroundSize: "200% 100%",
                animation: "shimmer 1.5s infinite",
                "@keyframes shimmer": {
                  "0%": { backgroundPosition: "200% 0" },
                  "100%": { backgroundPosition: "-200% 0" },
                },
              }}
            />
          ))}
        </Box>
      </motion.div>
    </Container>
  );
};

export default LoadingSkeleton;
