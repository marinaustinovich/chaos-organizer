import _ from 'lodash';

const appendFormData = (formData, key, value) => {
  if (_.isPlainObject(value)) {
    formData.append(key, JSON.stringify(value));
  } else if (_.isArray(value)) {
    value.forEach((item, index) => {
      appendFormData(formData, `${key}[${index}]`, item);
    });
  } else {
    formData.append(key, value);
  }
};

export default appendFormData;
