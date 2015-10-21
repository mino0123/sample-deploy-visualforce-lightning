module.exports = function (name) {
  return {
    component: `<aura:component implements="force:appHostable">
    <ltng:require
      scripts="/resource/${name}"
      styles="/resource/SLDS/styles/salesforce-lightning-design-system-ltng.min.css"
      afterScriptsLoaded="{!c.afterScriptsLoaded}"
      />
    <div id="content" class="slds"></div>
</aura:component>`,
    controller: `({
      afterScriptsLoaded: function (cmp, ev, helper) {
      }
    })`
  };
};