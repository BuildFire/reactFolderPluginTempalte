import React, { Fragment } from 'react';
import { hot } from 'react-hot-loader';
import BackgroundStyleField from './components/BackgroundStyleField/BackgroundStyleField';

class Design extends React.Component {
  
  state = {
    _buildfire: {
      plugins: {
        dataType: 'pluginInstance',
        data: []
      }
    },
    content: {
      title: '',
      loadAllPlugins: false
    },
    design: {
      backgroundImage: null,
      lgBackgroundImage: null
    },
    default: true
  };

  componentDidMount() {
    this.getData()
    .then((result) => {
      if (!Object.keys(result.data).length) {
        this.saveData(this.state);
      } else {
        this.setState(() => result.data);
      }
    })
    .catch((err) => {
      console.error(`Error saving data: ${err}`);
    });
  }

  getData = () => {
    return new Promise((success, reject) => {
      return buildfire.datastore.get((err, result) => {
        if (err) return reject(err);
        return success(result);
      });
    });
  }

  saveData = (data) => {
    return new Promise((success, reject) => {
      return buildfire.datastore.save(data, (err, result) => {
        if (err) return reject(err);
        return success(result);
      });
    });
  }

  changeBackgroundLargeSize = (event) => {
    event.preventDefault();
    this.changeBackground()
    .then(([lgBackgroundImage]) => {
      const newState = {
        ...this.state,
        design: {
          ...this.state.design,
          lgBackgroundImage
        }
      };
      return this.saveData(newState);
    })
    .then((result) => {
      this.setState(() => result.data);
    })
    .catch((err) => {
      console.error('Error saving data:', err);
    });
  }

  changeBackgroundSmallSize = (event) => {
    event.preventDefault();
    this.changeBackground()
    .then(([backgroundImage]) => {
      const newState = {
        ...this.state,
        design: {
          ...this.state.design,
          backgroundImage
        }
      };
      return this.saveData(newState);
    })
    .then((result) => {
      this.setState(() => result.data);
    })
    .catch((err) => {
      console.error('Error saving data:', err);
    });
  }

  changeBackground = (size) => {
    return new Promise((success, reject) => {
      buildfire.imageLib.showDialog({ showIcons: false, multiSelection: false }, (error, result) => {
        if (error) return reject(error);
        const { selectedFiles = [] } = result;
        return success(selectedFiles);
      });
    });
  }

  removeSmallBackground = (event) => {
    event.preventDefault();
    const newState = {
      ...this.state,
      design: {
        ...this.state.design,
        backgroundImage: null
      }
    };

    this.saveData(newState)
    .then((result) => {
      this.setState(() => result.data);
    })
    .catch((err) => {
      console.error('Error saving data:', err);
    });
  }

  removeLargeBackground = () => {
    event.preventDefault();
    const newState = {
      ...this.state,
      design: {
        ...this.state.design,
        lgBackgroundImage: null
      }
    };

    this.saveData(newState)
    .then((result) => {
      this.setState(() => result.data);
    })
    .catch((err) => {
      console.error('Error saving data:', err);
    });
  }

  render() {
    return (
      <div>
        <BackgroundStyleField
          smallBackground={this.state.design.backgroundImage}
          largeBackground={this.state.design.lgBackgroundImage}
          changeBackgroundLargeSize={this.changeBackgroundLargeSize}
          changeBackgroundSmallSize={this.changeBackgroundSmallSize}
          removeSmallBackground={this.removeSmallBackground}
          removeLargeBackground={this.removeLargeBackground}
        />
        <hr />
      </div>
    );
  }
}

export default hot(module)(Design);
