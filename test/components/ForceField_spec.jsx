import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import {fromJS} from 'immutable';
import {expect} from 'chai';
// import {ForceField} from '../../src/components/Editor/ForceField';

const {renderIntoDocument, scryRenderedDOMComponentsWithClass, Simulate} = ReactTestUtils;

describe('ForceField', () => {
  xit('renders given points in force field stage', () => {
    const points = fromJS([{id: 1, x: 20, y: 30}, {id: 2, x: 40, y: 70}]);

    const component = renderIntoDocument(<ForceField points={points} />);
    const renderedPoints = scryRenderedDOMComponentsWithClass(component, 'force-field-stage-point');

    expect(renderedPoints.length).to.equal(2);

    expect(renderedPoints[0].style.left).to.equal('20%');
    expect(renderedPoints[0].style.top).to.equal('30%');
    expect(renderedPoints[1].style.left).to.equal('40%');
    expect(renderedPoints[1].style.top).to.equal('70%');
  });
});
