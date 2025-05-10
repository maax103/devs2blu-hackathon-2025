import "./App.css";
import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Container, 
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Divider,
  IconButton,
  AppBar,
  Toolbar,
  useTheme,
  ThemeProvider,
  createTheme
} from '@mui/material';
import { 
  Home as HomeIcon, 
  Description as DescriptionIcon, 
  Update as UpdateIcon, 
  Menu as MenuIcon,
  CloudUpload as CloudUploadIcon,
  Close as CloseIcon
} from '@mui/icons-material';

// Define custom theme to match the design
const theme = createTheme({
  palette: {
    primary: {
      main: '#133474', // Dark blue from the image
    },
    secondary: {
      main: '#f3f0f7', // Light purple for background elements
    },
    background: {
      default: '#f4f4f4',
    },
  },
  typography: {
    fontFamily: 'Geneva, Verdana, sans-serif',
    h1: {
      fontSize: '1.8rem',
      fontWeight: 600,
      color: '#133474',
    },
  },
});

function App() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resposta, setResposta] = useState(null);
  const [error, setError] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setError("");
    } else if (selectedFile) {
      setFile(null);
      setFileName("");
      setError("Por favor, selecione apenas arquivos PDF.");
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      setError("Por favor, selecione um arquivo PDF para análise.");
      return;
    }

    setIsLoading(true);
    setError("");

    const formData = new FormData();
    formData.append('file', file);

    try {
      const url = `http://${import.meta.env.VITE_SERVER_HOST}:${import.meta.env.VITE_SERVER_PORT}/ai/pdf`;
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setResposta(data);
    } catch (error) {
      console.error("Erro:", error);
      setError(`Ocorreu um erro ao enviar o PDF: ${error.message}`);
      setResposta(null);
    } finally {
      setIsLoading(false);
    } 
      
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  // Componente para mostrar o nível de risco
  const RiskBadge = ({ level }) => {
    const getColor = () => {
      switch (level) {
        case "Alto":
          return "#e74c3c";
        case "Médio":
          return "#f39c12";
        case "Baixo":
          return "#2ecc71";
        default:
          return "#eeeeee";
      }
    };

    return (
      <Box
        sx={{
          backgroundColor: getColor(),
          color: 'white',
          padding: '4px 12px',
          borderRadius: '12px',
          fontWeight: 'bold',
          fontSize: '0.85rem',
          display: 'inline-block'
        }}
      >
        {level}
      </Box>
    );
  };

  // Componente para exibir uma categoria
  const CategoryTag = ({ category }) => {
    return (
      <Box
        sx={{
          backgroundColor: theme.palette.primary.main,
          color: 'white',
          padding: '5px 12px',
          borderRadius: '20px',
          fontSize: '0.85rem',
          fontWeight: 500,
          margin: '2px',
          display: 'inline-block'
        }}
      >
        {category}
      </Box>
    );
  };

  // Componente para renderizar a análise do contrato
  const AnalysisResult = ({ data }) => {
    return (
      <Box sx={{ width: '100%' }}>
        {data.map((clause, index) => (
          <Paper 
            key={index} 
            elevation={1} 
            sx={{ 
              p: 3, 
              mb: 3, 
              borderRadius: 2,
              backgroundColor: theme.palette.secondary.main
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: { xs: 'flex-start', md: 'center' },
              justifyContent: 'space-between',
              mb: 2,
              pb: 2,
              borderBottom: '1px solid rgba(0,0,0,0.1)'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    backgroundColor: theme.palette.primary.main,
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    mr: 1
                  }}
                >
                  {clause.number}
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                  {clause.clauseId}
                </Typography>
              </Box>
              
              <Typography variant="h6" component="h2" sx={{ 
                flexGrow: 1, 
                color: theme.palette.primary.main,
                my: { xs: 1, md: 0 },
                mx: { xs: 0, md: 2 }
              }}>
                {clause.title}
              </Typography>
              
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                mt: { xs: 1, md: 0 }
              }}>
                <Typography variant="body2" sx={{ mr: 1 }}>
                  Nível de Risco:
                </Typography>
                <RiskBadge level={clause.riskLevel} />
              </Box>
            </Box>
            
            <Box sx={{ 
              p: 2, 
              mb: 3, 
              backgroundColor: 'rgba(255,255,255,0.5)',
              borderRadius: 1,
              borderLeft: `4px solid ${theme.palette.primary.main}`,
              fontStyle: 'italic'
            }}>
              <Typography>{clause.text}</Typography>
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'medium' }}>
                Categorias
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {clause.categories.map((category, catIndex) => (
                  <CategoryTag key={catIndex} category={category} />
                ))}
              </Box>
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'medium' }}>
                Problemas Identificados
              </Typography>
              <Box component="ul" sx={{ pl: 2 }}>
                {clause.issues.map((issue, issueIndex) => (
                  <Typography component="li" key={issueIndex} sx={{ mb: 1 }}>
                    {issue}
                  </Typography>
                ))}
              </Box>
            </Box>
            
            <Paper sx={{ 
              p: 2, 
              backgroundColor: '#dfd9e6',
              borderRadius: 1,
              borderLeft: '4px solid #27ae60'
            }}>
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'medium' }}>
                Recomendações
              </Typography>
              <Box component="ul" sx={{ pl: 2 }}>
                {clause.recommendations.map((rec, recIndex) => (
                  <Typography component="li" key={recIndex} sx={{ mb: 1 }}>
                    {rec}
                  </Typography>
                ))}
              </Box>
            </Paper>
          </Paper>
        ))}
      </Box>
    );
  };

  // Sidebar content
  const sidebarContent = (
    <Box sx={{ width: 250 }} role="presentation">
        <Typography variant="h6" component="div">
          JurisIA
        </Typography>
      <Divider />
      <List>
        <ListItem button selected>
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Início" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <DescriptionIcon />
          </ListItemIcon>
          <ListItemText primary="Salvos" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <UpdateIcon />
          </ListItemIcon>
          <ListItemText primary="Updates" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', bgcolor: 'background.default', minHeight: '100vh' }}>
        {/* Permanent sidebar for larger screens */}
        <Drawer
          sx={{
            width: 250,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: 250,
              boxSizing: 'border-box',
              bgcolor: 'white',
            },
            display: { xs: 'none', sm: 'block' }
          }}
          variant="permanent"
          anchor="left"
          open
        >
          {sidebarContent}
        </Drawer>

        {/* Temporary drawer for mobile */}
        <Drawer
          sx={{
            '& .MuiDrawer-paper': {
              width: 250,
              boxSizing: 'border-box',
            },
            display: { xs: 'block', sm: 'none' }
          }}
          anchor="left"
          open={drawerOpen}
          onClose={toggleDrawer}
        >
          {sidebarContent}
        </Drawer>

        {/* Main content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - 250px)` },
            ml: { sm: '250px' }
          }}
        >
          <AppBar 
            position="static" 
            color="transparent" 
            elevation={0} 
            sx={{ 
              mb: 4,
              display: { xs: 'block', sm: 'none' }
            }}
          >
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={toggleDrawer}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
          
          <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography variant="h1" component="h1">
                JurisIA
              </Typography>
            </Box>

            <Paper 
              elevation={2} 
              sx={{ 
                p: 3, 
                mb: 4, 
                borderRadius: 2,
                backgroundColor: theme.palette.secondary.main,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100px'
              }}
            >
              <input
                accept="application/pdf"
                id="pdf-file-upload"
                type="file"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              <label htmlFor="pdf-file-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<CloudUploadIcon />}
                  sx={{ 
                    mb: 2,
                    width: '100%',
                    height: '60px',
                    borderStyle: 'dashed',
                    borderWidth: '2px',
                    color: fileName ? theme.palette.primary.main : 'text.secondary'
                  }}
                >
                  {fileName ? fileName : "Insira um arquivo para análise"}
                </Button>
              </label>

              

              {error && (
                <Box sx={{ 
                  color: 'error.main',
                  bgcolor: 'error.light',
                  p: 1,
                  borderRadius: 1,
                  width: '100%',
                  mb: 2
                }}>
                  <Typography variant="body2">{error}</Typography>
                </Box>
              )}

              <Button 
                variant="contained" 
                color="primary"
                onClick={handleSubmit}
                disabled={isLoading || !file}
                sx={{ 
                  px: 4,
                  py: 1,
                  borderRadius: '50px',
                  width: { xs: '100%', sm: 'auto' }
                }}
              >
                {isLoading ? (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                    Analisando...
                  </Box>
                ) : "Analisar PDF"}
              </Button>
            </Paper>

            <Paper 
              elevation={3} 
              sx={{ 
                p: 3, 
                minHeight: '400px',
                maxHeight: '800px',
                overflowY: 'auto',
                borderRadius: 2,
                bgcolor: theme.palette.secondary.main
              }}
            >
              {isLoading ? (
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '300px'
                }}>
                  <CircularProgress size={40} sx={{ mb: 2 }} />
                  <Typography>Analisando documento PDF...</Typography>
                </Box>
              ) : resposta ? (
                <AnalysisResult data={resposta} />
              ) : (
                <Box sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '300px',
                  textAlign: 'center'
                }}>
                  <Typography color="text.secondary">
                    Nenhuma resposta ainda. Faça upload de um arquivo PDF e clique em Analisar PDF para começar.
                  </Typography>
                </Box>
              )}
            </Paper>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;