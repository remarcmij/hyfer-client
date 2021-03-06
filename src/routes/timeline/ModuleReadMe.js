import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import GridContainer from '../../components/GridContainer';
import MarkdownViewer from '../../components/MarkdownViewer';

const HYF_GITHUB_URL = 'https://github.com/HackYourFuture';

const styles = (theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  gitHubButton: {
    marginRight: theme.spacing.unit,
    '& a': {
      textDecoration: 'none',
    },
  },
  icon: {
    marginLeft: theme.spacing.unit * 2,
  },
});

@inject('currentModule')
@observer
class ModuleReadMe extends Component {
  componentDidMount() {
    this.props.currentModule.getReadMe('curriculum');
  }

  render() {
    const { readMe } = this.props.currentModule;
    if (!readMe) {
      return null;
    }

    const { classes } = this.props;

    return (
      <React.Fragment>
        <div className={classes.root}>
          <div className={classes.gitHubButton}>
            <a href={`${HYF_GITHUB_URL}/${readMe.repoName}`} target="_blank">
              <Button color="primary" className={classes.button}>
                Visit Repository
              <Icon className={classNames(classes.icon, 'fab fa-github')} />
              </Button>
            </a>
          </div>
        </div>
        <GridContainer>
          <MarkdownViewer markdown={readMe.markdown} />
        </GridContainer>
      </React.Fragment>
    );
  }
}

ModuleReadMe.wrappedComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  currentModule: PropTypes.object.isRequired,
};

export default withStyles(styles)(ModuleReadMe);
