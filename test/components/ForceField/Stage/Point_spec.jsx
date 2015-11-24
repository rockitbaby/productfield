import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import {fromJS} from 'immutable';
import {expect} from 'chai';
import Point from '../../../../src/components/ForceField/Stage/Point';

const {renderIntoDocument, scryRenderedDOMComponentsWithClass, Simulate} = ReactTestUtils;

describe('Point', () => {
  it('invokes callback it is clicked', () => {
    let clickedPointId;
    const pointClicked = (id) => clickedPointId = id;

    const component = renderIntoDocument(<Point id='SOME_UNIQ_ID' x={10} y={20} clicked={pointClicked}/>);
    const renderedPoint = scryRenderedDOMComponentsWithClass(component, 'force-field-stage-point')[0];

    Simulate.click(renderedPoint);

    expect(clickedPointId).to.equal('SOME_UNIQ_ID');
  });

  it('invokes callback when it is finished dragging', () => {
    let draggedPointId;
    const pointDragged = (id) => draggedPointId = id;

    const component = renderIntoDocument(<Point id='SOME_UNIQ_ID' x={10} y={20} draggedCallback={pointDragged}/>);
    const renderedPoint = scryRenderedDOMComponentsWithClass(component, 'force-field-stage-point')[0];

    Simulate.dragEnd(renderedPoint);

    expect(draggedPointId).to.equal('SOME_UNIQ_ID');
  });
});
