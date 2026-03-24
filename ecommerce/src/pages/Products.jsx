
import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Rating,
  CircularProgress,
  Alert,
  Pagination,
  ToggleButtonGroup,
  ToggleButton,
  Slider,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Search, GridView, ViewList, Clear, Visibility } from "@mui/icons-material";

function StatCard({ label, value }) {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
        <Typography variant="caption" color="text.secondary" noWrap>
          {label}
        </Typography>
        <Typography variant="h6" fontWeight="bold" sx={{ fontSize: { xs: 18, sm: 20 } }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}

function stockChip(stock) {
  if (stock === 0) return { label: "Out of Stock", color: "error" };
  if (stock <= 10) return { label: "Low Stock", color: "warning" };
  return { label: "In Stock", color: "success" };
}

function ProductCard({ product, onView, isMobile }) {
  const s = stockChip(product.stock);

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 2,
      }}
    >
      <Box sx={{ position: "relative" }}>
        <CardMedia
          component="img"
          image={product.thumbnail}
          alt={product.title}
          sx={{
            height: { xs: 160, sm: 180, md: 200 },
            objectFit: "cover",
          }}
        />
        <Chip label={s.label} color={s.color} size="small" sx={{ position: "absolute", top: 8, left: 8 }} />
        <Chip
          label={`-${product.discountPercentage}%`}
          color="error"
          size="small"
          sx={{ position: "absolute", top: 8, right: 8 }}
        />
      </Box>

      <CardContent sx={{ flexGrow: 1, p: { xs: 1.5, sm: 2 } }}>
        <Typography variant="caption" color="text.secondary" noWrap>
          {product.category?.toUpperCase()}
        </Typography>

        <Typography
          variant={isMobile ? "body1" : "subtitle1"}
          fontWeight="bold"
          gutterBottom
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            minHeight: "2.6em",
          }}
        >
          {product.title}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <Rating value={product.rating} precision={0.1} size="small" readOnly />
          <Typography variant="caption" color="text.secondary">
            ({product.rating})
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" noWrap>
          {product.brand ? `Brand: ${product.brand}` : ""}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "baseline", gap: 1, mt: 1, flexWrap: "wrap" }}>
          <Typography variant="h6" fontWeight="bold" color="primary">
            ${product.price}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ textDecoration: "line-through" }}>
            ${(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}
          </Typography>
        </Box>

        <Typography variant="caption" color="text.secondary">
          Stock: {product.stock}
        </Typography>
      </CardContent>

      <CardActions sx={{ p: { xs: 1.5, sm: 2 }, pt: 0 }}>
        <Button fullWidth variant="contained" startIcon={<Visibility />} onClick={() => onView(product)}>
          View Details
        </Button>
      </CardActions>
    </Card>
  );
}

export default function Products() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | error | ready
  const [error, setError] = useState("");

  // Responsive pagination density
  const itemsPerPage = isMobile ? 6 : isTablet ? 9 : 12;

  // UI state
  const [viewMode, setViewMode] = useState(isMobile ? "list" : "grid");
  const [page, setPage] = useState(1);

  const [q, setQ] = useState("");
  const [category, setCategory] = useState("all");
  const [stock, setStock] = useState("all"); // all | in | low | out
  const [sortBy, setSortBy] = useState("name");
  const [priceRange, setPriceRange] = useState([0, 2000]);

  const [selected, setSelected] = useState(null);

  // Keep a sane view mode on resize (grid toggle hidden on mobile)
  useEffect(() => {
    if (isMobile) setViewMode("list");
  }, [isMobile]);

  useEffect(() => {
    (async () => {
      try {
        setStatus("loading");
        const res = await fetch("https://dummyjson.com/products?limit=100");
        const data = await res.json();
        const list = data?.products || [];
        setProducts(list);

        const max = Math.max(0, ...list.map((p) => p.price || 0));
        setPriceRange([0, max]);

        setStatus("ready");
      } catch {
        setError("Failed to load products.");
        setStatus("error");
      }
    })();
  }, []);

  const categories = useMemo(() => {
    return [...new Set(products.map((p) => p.category).filter(Boolean))].sort();
  }, [products]);

  const maxPrice = useMemo(() => Math.max(0, ...products.map((p) => p.price || 0)), [products]);

  const stats = useMemo(() => {
    const total = products.length;
    const inStock = products.filter((p) => p.stock > 0).length;
    const outOfStock = products.filter((p) => p.stock === 0).length;
    const avgPrice = total ? products.reduce((s, p) => s + (p.price || 0), 0) / total : 0;
    const totalValue = products.reduce((s, p) => s + (p.price || 0) * (p.stock || 0), 0);
    return {
      total,
      inStock,
      outOfStock,
      avgPrice: avgPrice.toFixed(2),
      totalValue: totalValue.toFixed(2),
    };
  }, [products]);

  const filteredSorted = useMemo(() => {
    const query = q.trim().toLowerCase();

    let list = products.filter((p) => {
      const matchesQuery =
        !query ||
        p.title?.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query) ||
        p.brand?.toLowerCase().includes(query) ||
        p.category?.toLowerCase().includes(query);

      const matchesCategory = category === "all" || p.category === category;

      const matchesStock =
        stock === "all" ||
        (stock === "in" && p.stock > 0) ||
        (stock === "low" && p.stock > 0 && p.stock <= 10) ||
        (stock === "out" && p.stock === 0);

      const matchesPrice = (p.price || 0) >= priceRange[0] && (p.price || 0) <= priceRange[1];

      return matchesQuery && matchesCategory && matchesStock && matchesPrice;
    });

    const sorter = {
      name: (a, b) => (a.title || "").localeCompare(b.title || ""),
      priceLow: (a, b) => (a.price || 0) - (b.price || 0),
      priceHigh: (a, b) => (b.price || 0) - (a.price || 0),
      rating: (a, b) => (b.rating || 0) - (a.rating || 0),
      stock: (a, b) => (b.stock || 0) - (a.stock || 0),
    }[sortBy];

    if (sorter) list.sort(sorter);
    return list;
  }, [products, q, category, stock, priceRange, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredSorted.length / itemsPerPage));

  // If filters shrink results, keep page valid
  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [page, totalPages]);

  const pageItems = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredSorted.slice(start, start + itemsPerPage);
  }, [filteredSorted, page, itemsPerPage]);

  const clear = () => {
    setQ("");
    setCategory("all");
    setStock("all");
    setSortBy("name");
    setPriceRange([0, maxPrice]);
    setPage(1);
  };

  if (status === "loading") {
    return (
      <Box sx={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (status === "error") {
    return (
      <Box sx={{ p: { xs: 2, sm: 3 } }}>
        <Alert severity="error" variant="filled">
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", px: { xs: 1, sm: 0 } }}>
      {/* Header */}
      <Box sx={{ mb: { xs: 1.5, sm: 2 } }}>
        <Typography variant={isMobile ? "h5" : "h4"} fontWeight="bold">
          Product Management
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Browse, search, and manage inventory
        </Typography>
      </Box>

      {/* Stats */}
      <Grid container spacing={{ xs: 1.5, sm: 2 }} sx={{ mb: { xs: 1.5, sm: 2 } }}>
        <Grid item xs={6} md={2.4}>
          <StatCard label="Total Products" value={stats.total} />
        </Grid>
        <Grid item xs={6} md={2.4}>
          <StatCard label="In Stock" value={stats.inStock} />
        </Grid>
        <Grid item xs={6} md={2.4}>
          <StatCard label="Out of Stock" value={stats.outOfStock} />
        </Grid>
        <Grid item xs={6} md={2.4}>
          <StatCard label="Avg Price" value={`$${stats.avgPrice}`} />
        </Grid>
        <Grid item xs={12} md={2.4}>
          <StatCard label="Total Value" value={`$${stats.totalValue}`} />
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: { xs: 1.5, sm: 2 }, mb: { xs: 1.5, sm: 2 } }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          sx={{ mb: 1.5, alignItems: { sm: "center" } }}
        >
          <TextField
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
            fullWidth
            size={isMobile ? "small" : "medium"}
            placeholder="Search products..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
              endAdornment: q ? (
                <InputAdornment position="end">
                  <Button size="small" onClick={() => setQ("")} startIcon={<Clear />}>
                    Clear
                  </Button>
                </InputAdornment>
              ) : null,
            }}
          />

          {!isMobile && (
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(_, v) => v && setViewMode(v)}
              size="small"
            >
              <ToggleButton value="grid">
                <GridView />
              </ToggleButton>
              <ToggleButton value="list">
                <ViewList />
              </ToggleButton>
            </ToggleButtonGroup>
          )}
        </Stack>

        <Grid container spacing={1.5} sx={{ mb: 1.5 }}>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size={isMobile ? "small" : "medium"}>
              <InputLabel>Category</InputLabel>
              <Select
                value={category}
                label="Category"
                onChange={(e) => {
                  setCategory(e.target.value);
                  setPage(1);
                }}
              >
                <MenuItem value="all">All</MenuItem>
                {categories.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size={isMobile ? "small" : "medium"}>
              <InputLabel>Stock</InputLabel>
              <Select
                value={stock}
                label="Stock"
                onChange={(e) => {
                  setStock(e.target.value);
                  setPage(1);
                }}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="in">In Stock</MenuItem>
                <MenuItem value="low">Low Stock</MenuItem>
                <MenuItem value="out">Out of Stock</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size={isMobile ? "small" : "medium"}>
              <InputLabel>Sort</InputLabel>
              <Select value={sortBy} label="Sort" onChange={(e) => setSortBy(e.target.value)}>
                <MenuItem value="name">Name</MenuItem>
                <MenuItem value="priceLow">Price ↑</MenuItem>
                <MenuItem value="priceHigh">Price ↓</MenuItem>
                <MenuItem value="rating">Rating</MenuItem>
                <MenuItem value="stock">Stock</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Clear />}
              onClick={clear}
              sx={{ height: { xs: 40, sm: 56 } }}
            >
              Clear Filters
            </Button>
          </Grid>
        </Grid>

        <Typography variant="body2" gutterBottom>
          Price Range: ${priceRange[0]} - ${priceRange[1]}
        </Typography>
        <Slider
          value={priceRange}
          min={0}
          max={maxPrice}
          valueLabelDisplay="auto"
          onChange={(_, v) => {
            setPriceRange(v);
            setPage(1);
          }}
        />

        <Typography variant="caption" color="text.secondary">
          Showing {pageItems.length} of {filteredSorted.length}
        </Typography>
      </Paper>

      {/* Results */}
      {filteredSorted.length === 0 ? (
        <Paper sx={{ p: { xs: 4, sm: 6 }, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No products found
          </Typography>
          <Button variant="contained" onClick={clear}>
            Clear All
          </Button>
        </Paper>
      ) : viewMode === "grid" ? (
        <Grid container spacing={{ xs: 1.5, sm: 2 }}>
          {pageItems.map((p) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={p.id}>
              <ProductCard product={p} onView={setSelected} isMobile={isMobile} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Stack spacing={{ xs: 1.5, sm: 2 }}>
          {pageItems.map((p) => {
            const s = stockChip(p.stock);
            return (
              <Card key={p.id} sx={{ borderRadius: 2 }}>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  sx={{ p: { xs: 1.5, sm: 2 } }}
                >
                  <Box
                    component="img"
                    src={p.thumbnail}
                    alt={p.title}
                    sx={{
                      width: { xs: "100%", sm: 220 },
                      height: { xs: 180, sm: 140 },
                      objectFit: "cover",
                      borderRadius: 2,
                      flexShrink: 0,
                    }}
                  />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="flex-start"
                      spacing={2}
                      sx={{ mb: 1 }}
                    >
                      <Box sx={{ minWidth: 0 }}>
                        <Typography fontWeight="bold" noWrap>
                          {p.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {p.brand ? `Brand: ${p.brand}` : ""}
                        </Typography>
                      </Box>
                      <Chip label={s.label} color={s.color} size="small" />
                    </Stack>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1, flexWrap: "wrap" }}>
                      <Rating value={p.rating} precision={0.1} size="small" readOnly />
                      <Typography variant="body2" color="text.secondary">
                        ${p.price} • Stock: {p.stock}
                      </Typography>
                    </Box>

                    <Button
                      variant="contained"
                      startIcon={<Visibility />}
                      onClick={() => setSelected(p)}
                      size={isMobile ? "small" : "medium"}
                      fullWidth={isMobile}
                      sx={{ mt: { xs: 1, sm: 0 } }}
                    >
                      View Details
                    </Button>
                  </Box>
                </Stack>
              </Card>
            );
          })}
        </Stack>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: { xs: 2, sm: 3 } }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, v) => {
              setPage(v);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            color="primary"
            size={isMobile ? "small" : "large"}
            showFirstButton
            showLastButton
          />
        </Box>
      )}

      {/* Responsive Dialog */}
      <Dialog
        open={!!selected}
        onClose={() => setSelected(null)}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
      >
        {selected && (
          <>
            <DialogTitle sx={{ pb: 1 }}>
              <Typography variant={isMobile ? "h6" : "h5"} fontWeight="bold">
                {selected.title}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap" }}>
                <Chip label={selected.category} size="small" />
                <Chip label={stockChip(selected.stock).label} color={stockChip(selected.stock).color} size="small" />
                <Chip label={`-${selected.discountPercentage}%`} color="error" size="small" />
              </Stack>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={{ xs: 2, sm: 3 }}>
                <Grid item xs={12} md={6}>
                  <Box
                    component="img"
                    src={selected.thumbnail}
                    alt={selected.title}
                    sx={{
                      width: "100%",
                      height: { xs: 240, sm: 320, md: 360 },
                      objectFit: "cover",
                      borderRadius: 2,
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant={isMobile ? "h5" : "h4"} fontWeight="bold" color="primary">
                    ${selected.price}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, my: 1, flexWrap: "wrap" }}>
                    <Rating value={selected.rating} precision={0.1} readOnly />
                    <Typography variant="body2" color="text.secondary">
                      {selected.rating} / 5
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      • Stock: {selected.stock}
                    </Typography>
                  </Box>
                  {selected.brand && (
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Brand: {selected.brand}
                    </Typography>
                  )}
                  <Typography variant="body1">{selected.description}</Typography>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: { xs: 1.5, sm: 2 } }}>
              <Button onClick={() => setSelected(null)} fullWidth={isMobile}>
                Close
              </Button>
              <Button variant="contained" fullWidth={isMobile}>
                Edit Product
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
