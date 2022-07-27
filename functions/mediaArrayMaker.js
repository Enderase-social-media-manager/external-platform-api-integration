export function mediaArrayMaker(parameters) {
  var medias = [];
  parameters.content.content.forEach((content) => {
    if (content.name == 'media') {
      medias = content.value;
    }
  });

  return medias;
}
