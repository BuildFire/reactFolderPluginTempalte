
export const datastore = {
  getWithDynamicData: () => {
    return new Promise((success, reject) => {
      return buildfire.datastore.getWithDynamicData((err, result) => {
        if (err) return reject(err);
        return success(result);
      });
    });
  },
  get: () => {
    return new Promise((success, reject) => {
      return buildfire.datastore.get((err, result) => {
        if (err) return reject(err);
        return success(result);
      });
    });
  },
  save: (data) => {
    return new Promise((success, reject) => {
      return buildfire.datastore.save(data, (err, result) => {
        if (err) return reject(err);
        return success(result);
      });
    });
  }
};

export const messaging = {
  sendMessageToWidget: (...params) => {
    return buildfire.messaging.sendMessageToWidget(params);
  }
};

export const notifications = {
  confirm: (params) => {
    return new Promise((success, reject) => {
      return buildfire.notifications.confirm(params, () => {
        if (!params) return reject();
        return success();
      });
    });
  }
};
