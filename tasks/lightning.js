module.exports = function (name) {
  return {
    component: `<aura:component implements="force:appHostable">
    <ltng:require
      scripts="/resource/${name}"
      afterScriptsLoaded="{!c.afterScriptsLoaded}"
      />
</aura:component>`,
    controller: `({
      afterScriptsLoaded: function (cmp, ev, helper) {

      }
    })`
  };
};