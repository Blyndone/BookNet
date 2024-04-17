import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton'; // Import IconButton component
import SearchIcon from '@mui/icons-material/Search'; // Import SearchIcon
import InputAdornment from '@mui/material/InputAdornment';
import { useNavigate } from 'react-router-dom';

const Header = (props) => {
  const { loggedIn } = props;
  const navigate = useNavigate();
  const [query, setQuery] = React.useState(''); // [1
  const onButtonClick = () => {
    if (loggedIn) {
      localStorage.removeItem('user');
      props.setLoggedIn(false);
    } else {
      navigate('/login');
      localStorage.removeItem('user');
      localStorage.removeItem('role');
      localStorage.removeItem('loggedIn');
    }
  };

  return (
    <div>
      {/* Header */}
      <AppBar position="static" style={{ backgroundColor: 'B1DDF0' }}>
        <Toolbar>
          <Typography
            variant="h4"
            component="div"
            sx={{ flexGrow: 1, userSelect: 'none' }}
            onClick={() => {
              const user = JSON.parse(localStorage.getItem('user'));
              console.log('USER', user);
              if (user.role === 'employee') {
                navigate('/employee/emphome');
              } else if (user.role === 'customer') {
                navigate('/userhome');
              } else {
                navigate('/');
              }
            }}
          >
            Book.net
          </Typography>
          <form
            onSubmit={() => {
              navigate('/booksearch', { state: { q: query } });
            }}
          >
            <TextField
              label="Search"
              type=""
              onChange={(e) => {
                setQuery(e.target.value);
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment>
                    <IconButton type="submit">
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </form>
          <Button color="inherit" onClick={onButtonClick}>
            Log Out
          </Button>
          <Button
            color="inherit"
            onClick={() => {
              navigate('/profile');
            }}
          >
            Profile
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Header;
