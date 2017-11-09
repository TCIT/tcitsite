import React from 'react';
import {TextField, Checkbox, SelectField, CardText, CardActions} from 'react-md/';

import Toolbar from 'react-md/lib/Toolbars';
import Button from 'react-md/lib/Buttons';
import messages from './messages';
import CloseModal from 'components/CloseModal';
import CleanModal from 'components/CleanModal';

export default function ObservationForm ({formatMessage, controls, actions, templates, activeUserId, activeFacilityId}) {
  let protocolText = '';
  if (controls.searchProtocol) {
  	protocolText = <TextField
  		style={{height: '80px', overflow:'scroll', margin:'10px 0px', width: 'auto'}}
      placeholder={`${formatMessage({...messages.searchProtocol})}`}
  		block={true}
  		rows={4}
  		value = {controls.protocolNotes}
  		onChange={(value) => actions.controlsChanged({protocolNotes: value}, 'observation')}
  	/>;
  }
  let savingTemplateSection = '';
  if (controls.saveTemplate) {
  	savingTemplateSection = <div 
  		style={{height:'45px', color: 'white', background: 'black', opacity:0.8, margin: '-25px -35px', position: 'absolute', width: '100%'}} className='row'>
  		<div className='col-xs-5' style={{lineHeight: '45px', fontSize: '11px'}}>{formatMessage({...messages.name})}</div>
  		<div className='col-xs-4'>
        <TextField block
          inputClassName='white-textfield'
          inputStyle={{height: '15px'}}
          style={{border: 'white 1px solid', margin: '2px', height:'30px'}}
          placeholder={`${formatMessage({...messages.name})}...`}
          value={controls.nameTemplate} 
          onChange={ (value) => {
            if (value.length<=30) {
              actions.controlsChanged({nameTemplate: value}, 'observation');
            }
          }}/>
      </div>
  		<div className='col-xs-3' style={{fontSize: '25px'}}>
  			<Button style={{color: 'white'}}  label={<i className="fa fa-floppy-o" aria-hidden="true" ></i>}
          onClick={() => {
            const originContainer = document.getElementById('notes');
            const startPos = originContainer.selectionStart;
            const endPos = originContainer.selectionEnd;
            const selectedText = originContainer.value.substring(startPos, endPos);
            actions.saveTemplate(controls.nameTemplate, selectedText,activeUserId, activeFacilityId);
          }}/>
  			<Button style={{color: 'white'}} onClick={() => actions.controlsChanged({saveTemplate: false}, 'observation')} label ={<i className="fa fa-times-circle" aria-hidden="true" ></i>}/>
  		</div>
  	</div>;
  }
  return (
    <div>
      <CardText>
        <div style={{padding:'0px 20px'}}>
          <div className='row'>
            <div className='col-md-8'>
            	<SelectField
                label={formatMessage({...messages.savedTemplates})}
            		menuItems={templates}
            		itemLabel="name"
                fullWidth={true}
                position='below'
            		itemValue="id"
                value={controls.selectedTemplateId}
                onChange = {(value) => actions.controlsChanged({selectedTemplateId: value}, 'observation')}
            	/>
            </div>
            <div className='col-md-4'>
            	<Button 
            		onClick={() => {
            			const destinyContainer = document.getElementById('notes');
            			const caretPos = destinyContainer.selectionStart;
        	        const textAreaTxt = destinyContainer.value;
                  const selectedTemplate = templates.find((template) => template.id === controls.selectedTemplateId);
        	        const txtToAdd = selectedTemplate ? selectedTemplate.templateText : '';
        	        //destinyContainer.value = textAreaTxt.substring(0, caretPos) + txtToAdd + textAreaTxt.substring(caretPos);
            		  actions.controlsChanged({notes: textAreaTxt.substring(0, caretPos) + txtToAdd + textAreaTxt.substring(caretPos)}, 'observation')
                }}
            		style={{background: 'white', color:'darkOrange', height: '40px', padding: '0px 20px', marginTop: '35px'}}
            		label={formatMessage({...messages.include})} 
            	/>
            </div>
          </div>
          <div>
          	<TextField
          		id='notes'
              placeholder={`${formatMessage({...messages.observation})}*`}
          		style={{height: '80px', overflow:'scroll', margin:'10px 0px', width: 'auto'}}
          		block={true}
          		value={controls.notes}
          		rows={4} 
          		onChange={(value) => actions.controlsChanged({notes: value}, 'observation')}
          	/>
          	<Checkbox 
          		label={<span style={{color: 'gray'}}>{formatMessage({...messages.searchProtocol})}</span>}
          		checked={controls.searchProtocol}
          		onClick={() => actions.controlsChanged({searchProtocol: !controls.searchProtocol, protocolNotes: ''}, 'observation')}
          	/>
          	<div style={{height: '90px'}}>
          		{protocolText}
          	</div>
          	{savingTemplateSection}
          </div>
        </div>
      </CardText>
    </div>
  );
}
