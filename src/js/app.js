import React from 'react';
import { Button } from 'react-lightning-design-system';

function click() { alert('Clicked'); }

document.addEventListener('DOMContentLoaded', () => {
  React.render(
    <div className="slds">
      <Button onClick={ click }>Simple</Button>
      <Button type='neutral' onClick={ click }>Neutral</Button>
      <Button type='brand' onClick={ click }>Brand</Button>
      <Button type='neutral' icon='download' iconAlign='left' onClick={ click }>Icon #1</Button>
      <Button type='neutral' disabled>Disabled Neutral</Button>
      <Button type='brand' disabled>Disabled Brand</Button>


      <div className="slds-card">

  <div className="slds-card__header slds-grid">
    <div className="slds-media slds-media--center slds-has-flexi-truncate">
      <div className="slds-media__body">
        <h2 className="slds-text-heading--small slds-truncate">Card Header (2)</h2>
      </div>
    </div>
    <div className="slds-no-flex">
      <div className="slds-button-group">
        <button className="slds-button slds-button--neutral slds-button--small">Button</button>
        <button className="slds-button slds-button--icon-border-filled">
          <span className="slds-assistive-text">Show More</span>
        </button>
      </div>
    </div>
  </div>
  <div className="slds-card__body">
    <table className="slds-table slds-table--bordered slds-max-medium-table--stacked-horizontal slds-no-row-hover">
      <thead>
        <tr>
          <th className="slds-text-heading--label slds-size--1-of-4" scope="col">Name</th>
          <th className="slds-text-heading--label slds-size--1-of-4" scope="col">Company</th>
          <th className="slds-text-heading--label slds-size--1-of-4" scope="col">Title</th>
          <th className="slds-text-heading--label slds-size--1-of-4" scope="col">Email</th>
          <th className="slds-row-action" scope="col">
            <button className="slds-button slds-button--icon-border-filled slds-button--icon-border-small">
              <span className="slds-assistive-text">Show More</span>
            </button>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr className="slds-hint-parent">
          <td className="slds-size--1-of-4" data-label="Name">Adam Choi</td>
          <td className="slds-size--1-of-4" data-label="Company">Company One</td>
          <td className="slds-size--1-of-4" data-label="Title">Director of Operations</td>
          <td className="slds-size--1-of-4" data-label="Email">adam@company.com</td>
          <td>
            <Button type="neutral">
              <svg aria-hidden="true" class="slds-button__icon slds-button__icon--hint slds-button__icon--small"
              dangerouslySetInnerHTML={{__html:'<use xlink:href="resources/slds/assets/icons/utility-sprite/svg/symbols.svg#down"></use>'}}>
              </svg>
            </Button>
            <button className="slds-button slds-button--icon-border-filled slds-button--icon-border-small">
              <span className="slds-assistive-text">Show More</span>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div className="slds-card__footer"><a href="#">View All <span className="slds-assistive-text">entity type</span></a></div>


      </div>
    </div>
  , document.body);
});
