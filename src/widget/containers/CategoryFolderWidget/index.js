import React from 'react';
import './index.css';

class CategoryFolderWidget extends React.Component {
  onUpdateEvent = null;
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
    pluginList: [],
    default: true
  };

  componentDidMount() {
    this.loadData()
    .then(result => {

      if (result.data.content.loadAllPlugins) {
        this.getAllPlugins()
        .then((pluginProvider) => {
          this.setState(() => ({
            ...result.data,
            pluginList: pluginProvider.result
          }));
        })
      } else {
        this.setState(() => ({
          ...result.data,
          pluginList: result.data._buildfire.plugins.result
        }));
      }
    })
    .catch((err) => {
      console.error(`Error loading data: ${err}`);
    });

    this.onUpdateEvent = buildfire.datastore.onUpdate((result) => {
      console.warn('NEW_ON_UPDATE', result.data);
      this.setState((prevState) => this.getTheNewState({ ...prevState, ...result.data }));
    })
  }

  componentWillUnmount() {
    if (this.onUpdateEvent) {
      this.onUpdateEvent.clear();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.content.loadAllPlugins 
      !== prevState.content.loadAllPlugins) {

      if (this.state.content.loadAllPlugins) {
        this.getAllPlugins()
        .then((pluginProvider) => {
          this.setState(() => ({
            ...this.state,
            pluginList: pluginProvider.result
          }));
        })
      } else {
        this.setState(() => ({
          ...this.state,
          pluginList: this.state._buildfire.plugins.result
        }));
      }
    }
  }

  getTheNewState = (data) => {
    const pluginList = data._buildfire.plugins.data.map((instanceId) => {
      const pluginModel = data._buildfire.plugins.result
        .filter((plugin) => plugin.data.instanceId === instanceId);
      return pluginModel.length ? pluginModel[0] : {};
    });
    const newState = {
      ...data,
      pluginList
    };
    return newState;
  }

  loadData = () => {
    return new Promise((success, reject) => {
      return buildfire.datastore.getWithDynamicData('content', (err, result) => {
        if(err) {
          return reject(err);
        }
        return success(result);
      })
    });
  }

  getAllPlugins = () => {
    return new Promise((success, reject) => {
      let searchOptions = { pageIndex: 0, pageSize: 100 };  
      return buildfire.pluginInstance.search(searchOptions, (err, result) => {
        if (err) return reject(err);
        return success(result);
      });
    });
  }

  getDynamicStyles = () => {
    let backgroundImage = this.state.design.backgroundImage || this.state.design.lgBackgroundImage;

    if (this.state.design.lgBackgroundImage && window.innerWidth >= 600) {
      //iPads
      backgroundImage = this.state.design.lgBackgroundImage;
    }

    if (backgroundImage) {
      const backgroundUrl = buildfire.imageLib.cropImage(backgroundImage, {
        width: window.innerWidth,
        height: window.innerHeight
      });
  
      return {
        background: `no-repeat url(${backgroundUrl})`,
        backgroundSize: 'cover'
      };  
    }
    return {};
  }

  render() {
    const {
      content: {
        title
      },
      _buildfire: {
        plugins: {
          result = []
        }
      },
      pluginList
    } = this.state;

    return (
      <div style={this.getDynamicStyles()} className="CategoryFolderWidget">
        <div className="CategoryFolderWidget__container">
          <h1 className="CategoryFolderWidget__title">{title}</h1>
        </div>
        <ul>
          {pluginList.map((plugin) => (
            <li>{plugin.data.title}</li>
          ))}
        </ul>
      </div>
    );
  }
}
export default CategoryFolderWidget;
