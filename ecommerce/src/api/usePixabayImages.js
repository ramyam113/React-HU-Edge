import React, { useCallback, useEffect } from "react";

export const usePixabayImages = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [images, setImages] = useState([]);
  const searchImages = useCallback(async (query, page = 1, perPage = 20) => {
    if (!query.trim()) {
      setImages([]);
    }
    setLoading(true);
    setError(null);

    try {
      const mockImages = Array.from({ length: perPage }, (_, index) => ({
        id: `${page}-${index}`,
        webformatURL: `https://picsum.photos/seed/${query}- ${page}-${index}/300/200.jpg`,
        tags: query,
        user: "Mock User",
        likes: Math.floor(Math.random() * 100),
        downloads: Math.floor(Math.random() * 50),
      }));
      setImages((prev) => (page === 1 ? mockImages : [...prev, ...mockImages]));
    } catch (err) {
      setError("Failed to search Images");
    } finally {
      setLoading(false);
    }
  }, []);
  const clearImages = useCallback(() => {
    setImages([]);
    setError(null);
  }, []);
  return { images, loading, error, searchImages, clearImages };
};

export const useProductImage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (productName) {
      setImageUrl(`https://picsum.photos/seed/${productName}/50/50.jpg`);
    }
  }, [productName]);
  return { imageUrl, loading, error };
};

export default usePixabayImages;
