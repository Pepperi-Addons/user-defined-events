import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'

import { Flow } from '@pepperi-addons/papi-sdk';

import { FlowsService } from '../services/flows-service';

@Component({
  selector: 'edit-flow',
  templateUrl: './edit-flow.component.html',
  styleUrls: ['./edit-flow.component.scss']
})
export class EditFlowComponent implements OnInit {

  flow: Flow = undefined;

  constructor(
    private activateRoute: ActivatedRoute,
    private router: Router,
    private flowsService: FlowsService,
  ) { 

    const navigation = this.router.getCurrentNavigation();
    if(navigation) {
      this.flow = navigation.extras.state?.chosenFlow;
    }
    const flowID = this.activateRoute.snapshot.params.flow_id;
    if(!this.flow) {
      this.flowsService.getFlowByID(flowID).then(flow => {
        this.flow = flow
      })
    }
  }

  ngOnInit(): void {
  }

}
