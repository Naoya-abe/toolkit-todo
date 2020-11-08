import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import styles from './Header.module.scss';

const Header: React.FC = () => {
  return (
    <div className={styles.root}>
      <AppBar position="static" className={styles.app_bar}>
        <Toolbar className={styles.toolbar}>
          <Typography variant="h6">Redux Toolkit Todo</Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Header;
