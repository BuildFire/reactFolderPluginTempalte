import React from 'react';
import './index.css';

class CategoryFolderWidget extends React.Component {

  state = {
    categoryFilter: null,
    content: {
      title: ''
    },
    _buildfire: {
      plugins: {
        dataType: "pluginInstance",
        data: []
      }
    },
    design: {}
  };

  loadData = () => {
    return new Promise((success, reject) => {
      return buildfire.datastore.getWithDynamicData((err, result) => {
        if(err) {
          return reject(err);
        }
        return success(result);
      })
    });
  }

  onUpdate = () => {
    return new Promise((success, reject) => {
      return buildfire.datastore.onUpdate((result) => {
        if(!result) {
          return reject();
        }
        return success(result);
      })
    });
  }

  componentDidMount() {
    this.loadData()
    .then(result => this.setState(() => result.data))
    .catch((err) => {
      console.error(`Error loading data: ${err}`);
    });

    this.onUpdate()
    .then(data => this.loadData())
    .then(result => this.setState(() => result.data))
    .catch((err) => {
      console.error(`Error loading data:`, err);
    });
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
      }
    } = this.state;
    const pluginList = result || [];
    return (
      <div className="CategoryFolderWidget">
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
