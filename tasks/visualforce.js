module.exports = function (name) {
  return `<apex:page showHeader="false" standardStylesheets="false">
  <link rel="stylesheet" type="text/css" href="/resource/SLDS/styles/salesforce-lightning-design-system-scoped.min.css" />
  <div id="content" class="slds"></div>
  <script src="/resource/${name}"></script>
</apex:page>`;
};