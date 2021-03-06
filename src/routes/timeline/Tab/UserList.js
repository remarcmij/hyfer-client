import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import FormLabel from '@material-ui/core/FormLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import UserCard from '../../../components/UserCard';
import AddTeacherDialog from './AddTeacherDialog';

const styles = (theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    backgroundColor: theme.palette.background.default,
    margin: theme.spacing.unit,
  },
  toolbarContainer: {
    marginTop: theme.spacing.unit,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
  hideButton: {
    margin: theme.spacing.unit,
  },
  select: {
    margin: theme.spacing.unit,
  },
  selectMenu: {
    paddingLeft: theme.spacing.unit * 2,
  },
  text: {
    margin: theme.spacing.unit,
    flex: 1,
  },
  fab: {
    position: 'absolute',
    top: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
  },
});

@inject('currentModule')
@observer
class UserList extends React.Component {

  state = {
    isOpen: false,
    selectedWeek: 0,
    showAttendance: false,
  }

  openDialog = () => {
    this.setState({ isOpen: true });
  }

  closeDialog = () => {
    this.setState({ isOpen: false });
  }

  renderUsers(role, users) {

    const { classes } = this.props;
    const { showAttendance, selectedWeek } = this.state;

    if (users.length === 0) {
      return (
        <Typography variant="subheading" color="textSecondary" align="center" className={classes.text}>
          The list of {role === 'teacher' ? 'teachers' : 'students'} for this module is empty.
        </Typography>
      );
    }
    return users.map(user => (
      <UserCard
        key={user.id}
        user={user}
        selectedWeek={selectedWeek}
        showAttendance={showAttendance}
        showRemoveTeacher={role === 'teacher'}
      />
    ));
  }

  renderSelectItems(duration) {
    const items = [];
    for (let i = 0; i < duration; i++) {
      const label = `${i + 1}`;
      items.push(<MenuItem key={label} value={i}>{label}</MenuItem>);
    }
    return items;
  }

  handleWeekChange = (e) => this.setState({ selectedWeek: e.target.value })

  toggleShowAttendance = () => this.setState({ showAttendance: !this.state.showAttendance });

  renderWeekSelector(classes, duration) {
    return (
      <Select
        className={classes.select}
        value={this.state.selectedWeek}
        onChange={this.handleWeekChange}
        classes={{ selectMenu: classes.selectMenu }}
      >
        {this.renderSelectItems(duration)}
      </Select>
    );
  }

  render() {
    const { classes, currentModule, role } = this.props;
    const { selectedModule, group, students, teachers } = currentModule;

    let users = role === 'teacher' ? teachers : students;
    users = users.slice().sort((a, b) => a.username.localeCompare(b.username));

    return (
      <div className={classes.root}>
        {role === 'student' && this.state.showAttendance &&
          <Paper className={classes.toolbarContainer} elevation={2}>
            <Toolbar className={classes.toolbar}>
              <FormLabel>Attendance and Homework for week:</FormLabel>
              {this.renderWeekSelector(classes, selectedModule.duration)}
              <Button className={classes.hideButton} color="secondary" onClick={this.toggleShowAttendance}>
                Hide attendance
              </Button>
            </Toolbar>
          </Paper>}
        <div className={classes.container}>
          {this.renderUsers(role, users, this.state.selectedWeek)}
        </div>
        {role === 'teacher' && selectedModule &&
          <React.Fragment>
            <AddTeacherDialog
              open={this.state.isOpen}
              onClose={this.closeDialog}
            />
            <Tooltip title="Add teacher">
              <Button
                onClick={this.openDialog}
                variant="fab"
                color="secondary"
                aria-label="add"
                className={classes.fab}>
                <AddIcon />
              </Button>
            </Tooltip>
          </React.Fragment>}
        {role === 'student' && selectedModule && group.archived === 0 && !this.state.showAttendance &&
          <Tooltip title="Show attendances">
            <Button
              onClick={this.toggleShowAttendance}
              variant="fab"
              color="default"
              aria-label="add"
              className={classes.fab}>
              <Icon className="fas fa-briefcase" />
            </Button>
          </Tooltip>}

      </div>
    );
  }
}

UserList.wrappedComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  currentModule: PropTypes.object.isRequired,
  role: PropTypes.string.isRequired,
  showAttendance: PropTypes.bool,
};

export default withStyles(styles)(UserList);
