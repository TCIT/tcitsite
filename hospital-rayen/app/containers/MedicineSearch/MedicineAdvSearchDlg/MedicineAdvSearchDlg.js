/**
*
* MedicineAdvSearchDlg
*
*/

import React from 'react';
import FontIcon from 'react-md/lib/FontIcons';
import TextField from 'react-md/lib/TextFields';
import Button from 'react-md/lib/Buttons';
import update from 'immutability-helper';
import {drugTextToTerms, drugTermsToText} from 'utils/search-patterns';

require('!style-loader!css-loader!sass-loader!./MedicineAdvSearch.scss');

class MedicineAdvSearchDlg extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.handleFieldChanged = this.handleFieldChanged.bind(this);
    this.clickAcceptSearch = this.clickAcceptSearch.bind(this);
    // handle outside click
    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }
  /**
   * Set the wrapper ref
   */
  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  /**
   * Alert if clicked on outside of element
   */
  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      // do something if clicked outside of this components
      // alert('You clicked outside of me!');
    }
  }

  handleFieldChanged(field) {
    return (e) => {
      let newState = update(this.state, {
        [field]: {$set: e}
      });
    }
  }

  clickAcceptSearch() {
    let terms = {};
    if(this.state.genericName.length>0)
       terms.genericName = this.state.genericName;

    if(this.state.genericName.length>0)
       terms.genericName = this.state.genericName;

    if(this.state.brandName.length>0)
       terms.brandName = this.state.brandName;

    if(this.state.drugForm.length>0)
       terms.drugForm = this.state.drugForm;

    if(this.state.route.length>0)
       terms.route = this.state.route;

    if(this.state.manufacturer.length>0)
       terms.manufacturer = this.state.manufacturer;

    const text = drugTermsToText(terms);
    this.props.acceptSearchPatterns(text, terms);
  }

  componentWillMount() {
    const terms = drugTextToTerms(this.props.searchText);
    let newState = update(this.state, {
       genericName: {$set: (terms.genericName || '') },
       brandName: {$set: (terms.brandName || '') },
       drugForm: {$set: (terms.drugForm || '') },
       route: {$set: (terms.route || '')},
       manufacturer: {$set: (terms.manufacturer || '') },
    });
  }
  render() {
    return (
      <div ref={this.setWrapperRef} className="md-grid md-paper md-paper--1 advanced-search">
        <TextField
          leftIcon={<FontIcon>local_hospital</FontIcon>}
          id={this.state.baseId + "_gen_name"}
          value={this.state.genericName}
          onChange={this.handleFieldChanged("genericName")}
          label="Nombre genérico"
          lineDirection="center"
          placeholder="Nombre genérico"
          className="md-cell md-cell--8"
        />
        <TextField
          leftIcon={<FontIcon>label_outline</FontIcon>}
          id={this.state.baseId + "_brand_name"}
          value={this.state.brandName}
          onChange={this.handleFieldChanged("brandName")}
          label="Nombre de Marca"
          lineDirection="center"
          placeholder="Nombre de Marca"
          className="md-cell md-cell--8"
        />
        <TextField
          leftIcon={<FontIcon>add</FontIcon>}
          id={this.state.baseId + "_drug_form"}
          value={this.state.drugForm}
          onChange={this.handleFieldChanged("drugForm")}
          label="Presentación"
          lineDirection="center"
          placeholder="Presentación"
          className="md-cell md-cell--8"
        />
        <TextField
          leftIcon={<FontIcon>attach_money</FontIcon>}
          id={this.state.baseId + "_route"}
          value={this.state.route}
          onChange={this.handleFieldChanged("route")}
          label="Via de Administración"
          lineDirection="center"
          placeholder="Via de Administración"
          className="md-cell md-cell--8"
        />
        <TextField
          leftIcon={<FontIcon>phone</FontIcon>}
          id={this.state.baseId + "_manufact"}
          value={this.state.manufacturer}
          onChange={this.handleFieldChanged("manufacturer")}
          label="Fabricante"
          lineDirection="center"
          placeholder="Fabricante"
          className="md-cell md-cell--8"
        />
        <Button flat primary onClick={ this.clickAcceptSearch }>Buscar</Button>
      </div>
    );
  }
}

MedicineAdvSearchDlg.propTypes = {

};

export default MedicineAdvSearchDlg;
