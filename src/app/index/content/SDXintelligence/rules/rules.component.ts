import { Component, OnInit } from '@angular/core';
import { RuleService } from "../rules/services/rule.service";
import { EventService } from "../event/services/event.service";
import { ApplicationService } from "../application/services/application.service";
import { FormBuilder, FormGroup, Validators, EmailValidator } from "@angular/forms";
import { CommonService } from 'src/app/common/services/common.service';
import { ActivatedRoute, Router } from "@angular/router";
import { EventVariableService } from "../../SDXintelligence/eventvariable/services/eventvariable.service";
import { logging } from 'protractor';

@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.css']
})
export class RulesComponent implements OnInit {

  containers: any = [];
  expressionArray: any = [];
  expression: any = '';
  rule: any;
  showLoader: Boolean = false;
  submitted: Boolean = false;
  ruleForm: FormGroup;
  currentPage: String = "add";
  buttonName: String = "Create";
  events: any;
  eventMap: any = {};
  applicationMap: any = {};
  applications: any;
  variables: any;
  eventVariableMap: any = {};
  assetVariables: any = '<option value="category">Category</option>' +
    '<option value="subCategory">Sub Category</option>' +
    '<option value="assetIdentifier">Asset Identifier</option>' +
    '<option value="locationName">Location Name</option>' +
    '<option value="status">Status</option>' +
    '<option value="managementStatus">Management Status</option>' +
    '<option value="lifeCycleStatus">Life Cycle Status</option>';

  queryError: boolean = false;

  constructor(private formBuilder: FormBuilder,
    private ruleService: RuleService,
    private eventService: EventService,
    private applicationService: ApplicationService,
    private eventVariableService: EventVariableService,
    private route: ActivatedRoute,
    private router: Router,
    private commonService: CommonService) {
    this.route.params.subscribe(params => this.currentPage = params['page']);
  }

  ngOnInit() {
     // Page should start with loader
     this.showLoader = true;

    // Declare Form
    this.ruleForm = this.formBuilder.group({
      ruleId: [],
      ruleName: ['', Validators.required],
      active: ['true'],
      applicationId: ["", Validators.required],
      eventId: ["", Validators.required],
      applicationName: [null],
      eventName: [null],
      ruleExpression: [''],
      messageContent: [],
      conditions: [],
      comments: [],
      createdBy: [],
      createdByName: [],
      createdOn: []
    });

    // Patch Values if Edit
    console.log(this.currentPage);
    if (this.currentPage == "edit") {
      this.buttonName = "Update";
      let ruleId = localStorage.getItem("ruleId");
      if (ruleId != null) {
        this.getRule(ruleId);
      }
      else {
        this.router.navigate(['index/rules']);
      }
    }
    else {
      this.loadAllApplication(null);
      this.containers.push(1);
    }
  }


  onSubmit() {
    this.submitted = true;
    console.log(this.f.applicationName.get('data-name'));
    console.log(this.f.applicationName);

    if (this.ruleForm.invalid) {
      console.log('Mandatory fields missing');
      return;
    }

    if(this.expression == '')
    return;
    // Set the Expression
    this.f.ruleExpression.setValue(this.expression);
    this.f.conditions.setValue(this.expressionArray);

    this.f.applicationName.setValue(this.applicationMap[this.f.applicationId.value]);
    this.f.eventName.setValue(this.eventMap[this.f.eventId.value]);

    if (this.currentPage == "edit") {
      this.updateRule();
    }
    else {
      this.saveRule();
    }
  }

  getRule(ruleId: any) {
    this.ruleService.getRule(ruleId).subscribe(
      res => {
        console.log(res);
        this.rule = res;

        if(this.rule.conditions.length == 0)
        {
          this.removeAllContainers();
        }

        for (let i = 0; i < this.rule.conditions.length; i++) {
          let j = i + 1;
          this.containers.push(j);
        }
        this.ruleForm.patchValue(this.rule);
        this.expression = this.rule.ruleExpression;
        this.expressionArray = this.rule.conditions;
        // Load Apps and Events                
        this.loadAllApplication(this.rule.applicationId);
        this.loadAllEventByApp(this.rule.applicationId, this.rule.eventId);

      },
      err => {
        console.log("Error occured");
        this.showLoader = false;
        console.log(err);
        this.commonService.openSnackBar('Rule Load Failed : ' + err.error.message, 'badge-danger');
      }
    );
  }

  retainExpression(expressionArray: any) {
    for (let i = 0; i < expressionArray.length; i++) {
      let j = i + 1;
      $('#type' + j).val(expressionArray[i].conditionType);
      this.onChangeType(expressionArray[i].conditionType, 'type' + j);
      if (expressionArray[i].conditionType == 'asset') {
        $("#variable" + j).val(expressionArray[i].conditionKey);
      } else if (expressionArray[i].conditionType == 'event') {
        $('#variable' + j).val(expressionArray[i].keyId);
      }
      $('#operator' + j).val(expressionArray[i].conditionOperator);
      $('#value' + j).val(expressionArray[i].conditionValue);
      $('#condition' + j).val(expressionArray[i].conditionConnector);
    }
  }

  saveRule() {
    this.showLoader = true;
    this.ruleService.createRule(this.ruleForm.value).subscribe(
      res => {
        console.log(res);
        this.showLoader = false;
        this.commonService.openSnackBar("Rule Created Successfully", 'badge-success');
        this.router.navigate(['index/sdxintelligence/rules']);
      },
      err => {
        this.showLoader = false;
        console.log("Error occured");
        console.log(err);
        this.commonService.openSnackBar('Rule Creation Failed : ' + err.error.message, 'badge-danger');
      }
    );
  }

  updateRule() {
    this.showLoader = true;
    this.ruleService.updateRule(this.ruleForm.value).subscribe(
      res => {
        console.log(res);
        this.showLoader = false;
        this.commonService.openSnackBar("Rule Updated Successfully", 'badge-success');
         this.router.navigate(['index/sdxintelligence/rules']);
        // this.clear()
      },
      err => {
        this.showLoader = false;
        console.log("Error occured");
        console.log(err);
        this.commonService.openSnackBar('Rule Update Failed : ' + err.error.message, 'badge-danger');
      }
    );
  }

  loadAllEventByApp(applicationId: any, eventId: any) {
    if (applicationId == '') {
      this.events = [];
      this.variables = [];
      return;
    }
    this.showLoader = true;
    this.eventService.getAllEventsByApplication(applicationId).subscribe(
      res => {
        
        console.log(res);
        this.events = res;
        if (eventId != null) {
          this.f.eventId.setValue(eventId);
          this.loadAllVariableByEvent(eventId, true);
        }
        else
        {
          this.showLoader = false;
        }

        for (let i = 0; i < this.events.length; i++) {
          this.eventMap[this.events[i].eventId] = this.events[i].eventName;
        }

      },
      err => {
        this.showLoader = false;
        this.commonService.openSnackBar('Event Load Failed', 'badge-danger');
        console.log("Error occured");
      }
    );
  }


  loadAllVariableByEvent(eventId: any, retainFlag: Boolean) {
  
    if (eventId == '') {
      this.variables = [];
      return;
    }
    this.eventVariableService.getAllVariableByEvent(eventId).subscribe(
      res => {
      
        console.log(res);
        this.variables = res;
        this.eventVariableMap = {};
        for (let i = 0; i < this.variables.length; i++) {
          this.eventVariableMap[this.variables[i].variableId] = this.variables[i];
        }
        // Div construction takes time
        if (retainFlag) {
          setTimeout(() => {
            this.retainExpression(this.expressionArray);
            this.formQuery();
            this.showLoader = false;
          }, 300);
        }
        else
        {
          this.showLoader = false;
        }

      },
      err => {
        this.showLoader = false;
        this.commonService.openSnackBar('Variable Load Failed', 'badge-danger');
        console.log("Error occured");
      }
    );
  }

  loadAllApplication(applicationId: any) {
    if (applicationId == '') {
      this.variables = [];
      this.events = [];
      return;
    }
    this.showLoader = true;
    this.applicationService.getAllApplication().subscribe(
      res => {       
        console.log(res);
        this.applications = res;
        if (applicationId != null) {
          this.f.applicationId.setValue(applicationId);
        }
        else
        {
          this.showLoader = false;
        }

        for (let i = 0; i < this.applications.length; i++) {
          this.applicationMap[this.applications[i].applicationId] = this.applications[i].applicationName;
        }

      },
      err => {
        this.showLoader = false;
        this.commonService.openSnackBar('Application Load Failed', 'badge-danger');
        console.log("Error occured");
      }
    );
  }

  onChangeApplication(appId: any) {
    this.loadAllEventByApp(appId, null);
    this.expression = '';
    this.removeAllContainers();
  }
  onChangeEvent(eventId: any) {
    this.loadAllVariableByEvent(eventId, false);
    this.expression = '';
    this.removeAllContainers();
  }

  onChangeType(type: any, id: any) {
    let val = '<option value="">--Select--</option>';
    console.log(type);
    if (type == 'event') {
      for (let i = 0; i < this.variables.length; i++) {
        val += '<option value="' + this.variables[i].variableId + '">' + this.variables[i].variableName + '</option>'
      }
    }
    else if (type == 'asset') {
      val += this.assetVariables;
    }
    this.onChangeCondition(type, id);
    $('#variable' + id.substring(5, 4)).html(val);
  }

  formQuery() {
    this.expression = '';
    for (let i = 0; i < this.expressionArray.length; i++) {
      if (this.expressionArray[i].conditionType == 'asset') {
        this.expression += ' ${' + this.expressionArray[i].conditionType + '.' + this.expressionArray[i].conditionKey + '} ' + this.expressionArray[i].conditionOperator + ' ' + this.expressionArray[i].conditionValue +
          ' ' + this.expressionArray[i].conditionConnector;
      } else {
        this.expression += ' ${' + this.expressionArray[i].conditionType + '.' + this.eventVariableMap[this.expressionArray[i].keyId].variableName + '} ' + this.expressionArray[i].conditionOperator + ' ' + this.expressionArray[i].conditionValue +
          ' ' + this.expressionArray[i].conditionConnector;
      }
    }
    console.log(this.expression);
  }
  addContainer() {
    this.containers.push(this.containers.length + 1);
  }
  removeContainer() {
    if (this.containers.length == 1)
      return;
    $('#condition' + (this.containers.length - 1)).css('border', '');
    this.containers.splice(this.containers.length - 1, 1);

  }
  removeAllContainers() {
    this.containers = [];
    this.containers.push(1);
    $('#type1').val('');
    $('#variable1').html('<option value="">--Select--</option>');
    $('#variable1').val('');
    $('#operator1').val('');
    $('#value1').val('');
    $('#condition1').val('');
    // Remove css
    $('#type1').css('border', '');
    $('#variable1').css('border', '');
    $('#condition1').css('border', '');
    $('#operator1').css('border', '');
    $('#value1').css('border', '');
  }

  generateExpression() {
    if (this.f.applicationId.value == '' || this.f.eventId.value == '') {
      this.submitted = true;
      return;
    }
    this.queryError = false;

    this.expressionArray = [];
    if (this.containers.length == 0) {
      this.queryError = true;
      return;
    }
    for (let i = 1; i <= this.containers.length; i++) {
      let type = $('#type' + i).val();
      let variable = $('#variable' + i).val();
      let operator = $('#operator' + i).val();
      let value = $('#value' + i).val();
      let condition = $('#condition' + i).val();

      if (type != '' && variable != '' && operator != '' && value != '') {
        if (type == 'asset') {
          this.expressionArray.push(new Expression(type, variable, null, operator, value, condition,
            'TEXT'));
        }
        else {
          this.expressionArray.push(new Expression(type, this.eventVariableMap[+variable].variableName, variable, operator, value, condition,
            this.eventVariableMap[+variable].variableType));
        }
        $('#type' + i).css('border', '');
        $('#variable' + i).css('border', '');
        $('#condition' + i).css('border', '');
        $('#operator' + i).css('border', '');
        $('#value' + i).css('border', '');
      }
      else {
        type == '' ? $('#type' + i).css('border', '1px red solid') : $('#type' + i).css('border', '');
        variable == '' ? $('#variable' + i).css('border', '1px red solid') : $('#variable' + i).css('border', '');
        value == '' ? $('#value' + i).css('border', '1px red solid') : $('#value' + i).css('border', '');
        operator == '' ? $('#operator' + i).css('border', '1px red solid') : $('#operator' + i).css('border', '');

        this.queryError = true;
      }
      if (this.containers.length > 1) {
        if ($('#condition' + (i - 1)).val() == '') {
          $('#condition' + (i - 1)).css('border', '1px red solid');
          this.queryError = true;
        }
        else {
          $('#condition' + (i - 1)).css('');
        }
      }
    }

    if (this.queryError)
      return;
    this.queryError = false;
    console.log(this.expressionArray);
    this.formQuery();
  }

  onChangeCondition(value, id) {
    console.log(id);
    if (value != '') {
      $('#' + id).css('border', '');
    }
    else if (this.queryError) {
      $('#' + id).css('border', '1px red solid');
    }
  }

  get f() { return this.ruleForm.controls; }

  clear() {
    CommonService.resetPage(this.router);
  }

}
export class Expression {
  conditionType: string;
  conditionKey: string;
  keyId: number;
  conditionOperator: string;
  conditionValue: string;
  conditionConnector: string;
  conditionValueDataType: string;

  constructor(conditionType: any,
    conditionKey: any,
    keyId: any,
    conditionOperator: any,
    conditionValue: any,
    conditionConnector: any,
    conditionValueDataType: any) {
    this.conditionType = conditionType;
    this.conditionKey = conditionKey;
    this.keyId = keyId;
    this.conditionOperator = conditionOperator;
    this.conditionValue = conditionValue;
    this.conditionConnector = conditionConnector;
    this.conditionValueDataType = conditionValueDataType;
  }
}
