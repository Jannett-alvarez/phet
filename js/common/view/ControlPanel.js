// Copyright 2021, University of Colorado Boulder

/**
 * Main control panel for the optical element properties, visibility checkboxes  and the light rays mode
 * Appears at the bottom of the simulation
 *
 * @author Martin Veillette
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import merge from '../../../../phet-core/js/merge.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import NumberControl from '../../../../scenery-phet/js/NumberControl.js';
import AlignBox from '../../../../scenery/js/nodes/AlignBox.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Panel from '../../../../sun/js/Panel.js';
import SunConstants from '../../../../sun/js/SunConstants.js';
import VerticalAquaRadioButtonGroup from '../../../../sun/js/VerticalAquaRadioButtonGroup.js';
import VerticalCheckboxGroup from '../../../../sun/js/VerticalCheckboxGroup.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';
import geometricOpticsStrings from '../../geometricOpticsStrings.js';
import GeometricOpticsConstants from '../GeometricOpticsConstants.js';
import LightRayMode from '../model/LightRayMode.js';
import Optic from '../model/Optic.js';

const metersPattern = geometricOpticsStrings.metersPattern;
const noneString = geometricOpticsStrings.none;
const manyString = geometricOpticsStrings.many;
const marginalString = geometricOpticsStrings.marginal;
const principalString = geometricOpticsStrings.principal;
const curvatureRadiusString = geometricOpticsStrings.curvatureRadius;
const diameterString = geometricOpticsStrings.diameter;
const refractiveIndexString = geometricOpticsStrings.refractiveIndex;
const concaveString = geometricOpticsStrings.concave;
const convexString = geometricOpticsStrings.convex;
const focalPointString = geometricOpticsStrings.focalPoint;
const rulersString = geometricOpticsStrings.rulers;
const virtualImageString = geometricOpticsStrings.virtualImage;
const movablePointString = geometricOpticsStrings.movablePoint;
const guidesString = geometricOpticsStrings.guides;

class ControlPanel extends Panel {

  /**
   * @param {Optic} optic
   * @param {EnumerationProperty.<LightRayMode>} lightRayModeProperty
   * @param {VisibleProperties} visibleProperties
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Tandem} tandem
   * @param {Object} config
   */
  constructor( optic, lightRayModeProperty, visibleProperties, modelViewTransform, tandem, config ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    config = merge( {
      hasLens: false
    }, config );

    // items for ray Mode radio buttons
    const rayModeRadioButtonGroupItems = [
      { value: LightRayMode.MARGINAL_RAYS, node: new Text( marginalString ) },
      { value: LightRayMode.PRINCIPAL_RAYS, node: new Text( principalString ) },
      { value: LightRayMode.MANY_RAYS, node: new Text( manyString ) },
      { value: LightRayMode.NO_RAYS, node: new Text( noneString ) }
    ];

    // items for the type of curve for optical element
    const Curve = Optic.Curve;
    const curvatureTypesRadioButtonGroupItems = [
      { value: Curve.CONCAVE, node: new Text( concaveString ) },
      { value: Curve.CONVEX, node: new Text( convexString ) }
    ];

    // options for number controls that have length units
    const lengthNumberControlOptions =
      {
        delta: 0.1,
        layoutFunction: NumberControl.createLayoutFunction3(),
        numberDisplayOptions: {
          decimalPlaces: GeometricOpticsConstants.METER_DECIMAL_PLACES,
          valuePattern: StringUtils.fillIn( metersPattern, {
            meters: SunConstants.VALUE_NAMED_PLACEHOLDER
          } )
        },
        sliderOptions: {
          trackSize: new Dimension2( 120, 4 )
        }
      };

    // create number control for the radius of curvature of optical element
    const curvatureRadiusControl = new NumberControl(
      curvatureRadiusString,
      optic.radiusOfCurvatureProperty,
      optic.radiusOfCurvatureProperty.range,
      lengthNumberControlOptions );

    // create number control for the diameter of optical element
    const diameterControl = new NumberControl(
      diameterString,
      optic.diameterProperty,
      optic.diameterProperty.range,
      lengthNumberControlOptions );

    // array of number controls
    let controls;

    if ( config.hasLens ) {

      // options for index of refraction control
      const indexOfRefractionNumberControlOptions =
        {
          delta: 0.01,
          layoutFunction: NumberControl.createLayoutFunction3(),
          numberDisplayOptions: {
            decimalPlaces: GeometricOpticsConstants.INDEX_DECIMAL_PLACES
          },
          sliderOptions: {
            trackSize: new Dimension2( 120, 4 )
          }
        };

      // create number control for the index of refraction of lens
      const indexOfRefractionControl = new NumberControl(
        refractiveIndexString,
        optic.indexOfRefractionProperty,
        optic.indexOfRefractionProperty.range,
        indexOfRefractionNumberControlOptions );

      // add three number controls
      controls = [ curvatureRadiusControl,
        indexOfRefractionControl,
        diameterControl ];
    }
    else {
      // if not a lens, add two number controls
      controls = [ curvatureRadiusControl,
        diameterControl ];
    }

    // create button radio group for the light ray mode
    const rayModeRadioButtonGroup = new VerticalAquaRadioButtonGroup(
      lightRayModeProperty,
      rayModeRadioButtonGroupItems, {
        spacing: 8,
        align: 'left',
        radioButtonOptions: {
          radius: 7
        },
        touchAreaXDilation: 10,
        mouseAreaXDilation: 10
      } );

    // create checkbox group for visibility settings
    const checkboxGroupItems = [
      {
        node: new Text( focalPointString ),
        property: visibleProperties.visibleFocalPointProperty,
        tandem: tandem
      },
      {
        node: new Text( rulersString ),
        property: visibleProperties.visibleRulersProperty,
        tandem: tandem
      },
      {
        node: new Text( virtualImageString ),
        property: visibleProperties.visibleVirtualImageProperty,
        tandem: tandem
      },
      {
        node: new Text( movablePointString ),
        property: visibleProperties.visibleMovablePointProperty,
        tandem: tandem
      },
      {
        node: new Text( guidesString ),
        property: visibleProperties.visibleGuidesProperty,
        tandem: tandem
      }
    ];

    // create check box group
    const checkboxGroup = new VerticalCheckboxGroup( checkboxGroupItems );

    const separator = new Line( 0, 10, 0, 100, { stroke: 'gray', lineWidth: 1 } );

    // create radio button group for the type of curve (Convex and concave)
    const curvatureTypesRadioButtonGroup = new VerticalAquaRadioButtonGroup(
      optic.curveProperty,
      curvatureTypesRadioButtonGroupItems, {
        spacing: 8,
        align: 'left',
        radioButtonOptions: {
          radius: 7
        },
        touchAreaXDilation: 10,
        mouseAreaXDilation: 10
      } );

    // add all elements of the panel in a horizontal HBox
    const content = new AlignBox( new HBox( {
      spacing: 8,
      align: 'left',
      children: [ rayModeRadioButtonGroup,
        separator, ...controls,
        curvatureTypesRadioButtonGroup, checkboxGroup ]
    } ), {
      xAlign: 'left'
    } );

    super( content );

  }
}

geometricOptics.register( 'ControlPanel', ControlPanel );
export default ControlPanel;
