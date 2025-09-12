import meta from '../lib/meta.js';

const { API_TOKEN = '' } = process.env;
const filePath = 'disk:/CV.pdf';

(async () => {
  try {
    await meta.add(API_TOKEN, filePath, {
      my_field: 'my_value'
    });

    const metaGet = await meta.get(API_TOKEN, filePath, {
      fields: 'name,path,custom_properties'
    });
    console.log(`${metaGet.name} (${metaGet.path})`);

    Object.keys(metaGet.custom_properties).forEach((propertyName) =>
      console.log(
        `- ${propertyName}: ${metaGet.custom_properties[propertyName]}`
      )
    );
  } catch (error) {
    console.error(error);
  }
})();
