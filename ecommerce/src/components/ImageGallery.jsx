import { Search } from "@mui/icons-material";
import {
  Box,
  Grid,
  Card,
  Alert,
  Button,
  Typography,
  TextField,
  CardActionArea,
  CardMedia,
  CircularProgress,
  IconButton,
} from "@mui/material";
import React from "react";
import usePixabayImages from "../api/usePixabayImages";

function ImageGallery({ onSelectImage, maxImage = 10 }) {
  const [searchQuery, setSearchQuery] = useState("");

  const { images, loading, error, searchImages, loadMore, hasMore } =
    usePixabayImages();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      searchImages(searchQuery);
    }
  };

  const handleSelectImage = (image) => {
    if (onSelectImage) {
      onSelectImage(image);
    }
  };
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Image Gallery
      </Typography>
      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search for images"
          value={searchQuery}
          onChange={(e) => searchQuery(e.target.value)}
          InputProps={{
            startAdornment: <Search />,
          }}
        />
        <Button
          variant="contained"
          onClick={handleSearch}
          disabled={loading}
          startIcon={<Search />}
          sx={{ ml: 1 }}
        >
          Search
        </Button>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load Image: {error}
        </Alert>
      )}
      {loading && (
        <Box display="flex" justifyContent="center" p={3}>
          <CircularProgress />
        </Box>
      )}
      <Gird container spacing={2}>
        {images.map((image, index) => (
          <Gird item xs={12} sm={6} md={4} lg={3} key={image.id}>
            <Card>
              <CardActionArea onClick={() => handleSelectImage(image)}>
                <CardMedia
                  component="img"
                  height="200"
                  image={image.webformatURL}
                  alt={image.tags}
                />
              </CardActionArea>
              <Box p={1}>
                <Typography variant="body2" noWrap>
                  {image.user}
                </Typography>
                <Typography variant="caption" display="block">
                  {image.likes} {image.downloads}
                </Typography>
              </Box>
            </Card>
          </Gird>
        ))}
      </Gird>

      {!loading && hasMore && images.length > 0 && (
        <Box display="flex" justifyContent="center" p={2}>
          <Botton onClick={loadMore} variant="outlined">
            Load More Images
          </Botton>
        </Box>
      )}
      {!loading && images.length === 0 && searchQuery.trim() && (
        <Box textAlign="center" p={4}>
          <Typography color="text.secondary">
            No Images found for "{searchQuery}"
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Try different key words or check spelling
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default ImageGallery;
