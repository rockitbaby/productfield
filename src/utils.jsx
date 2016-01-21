
// wating for https://github.com/facebook/react/pull/5714/files in react 0.15.0
// for now:
// https://github.com/facebook/react/issues/1657#issuecomment-70786561

export function allowCustomAttributes(DOMProperty, customAttributes) {

  DOMProperty.injection.injectDOMPropertyConfig({
    isCustomAttribute(attributeName) {
      return (customAttributes.indexOf(attributeName) !== -1);
    },
  });

}