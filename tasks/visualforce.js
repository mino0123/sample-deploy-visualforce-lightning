module.exports = function (name) {
  return `<apex:page>
  <div id="content"></div>
  <script src="/resource/${name}"></script>
</apex:page>`;
};