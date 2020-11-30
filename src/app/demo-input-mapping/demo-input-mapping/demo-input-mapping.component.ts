import { Component, OnInit } from '@angular/core';
import { IsInputMappingInput, IsInputMappingValue } from 'projects/is-input-mapping/src/public_api';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-demo-input-mapping',
  templateUrl: './demo-input-mapping.component.html',
  styleUrls: ['./demo-input-mapping.component.scss']
})
export class DemoInputMappingComponent implements OnInit {
  usage = `

<h3>Installation</h3>
<pre>npm install --save https://github.com/IntelStudios/is-components-ngx/raw/7.x/package/is-input-mapping-7.2.24.tgz</pre>

<h3>Import Module</h3>
<pre>import { IsInputMappingModule } from 'is-input-mapping';</pre>
`;

  MOCK_DATA: IsInputMappingInput = {
  'InputSchema': [
    {
      'Name': 'Name',
      'DataType': 2,
      'AllowNull': false,
      'IsComplex': false
    },
    {
      'Name': 'Surname',
      'DataType': 2,
      'AllowNull': false,
      'IsComplex': false
    },
    {
      'Name': 'Directory',
      'DataType': 2,
      'AllowNull': false,
      'IsComplex': false
    },
    {
      'Name': 'FullPath',
      'DataType': 2,
      'AllowNull': false,
      'IsComplex': false
    },
    {
      'Name': 'Extension',
      'DataType': 2,
      'AllowNull': false,
      'IsComplex': false
    },
    {
      'Name': 'Data',
      'DataType': 4,
      'AllowNull': false,
      'IsComplex': false
    },
    {
      'Name': 'Size',
      'DataType': 1,
      'AllowNull': true,
      'IsComplex': false
    },
    {
      'Name': 'Created',
      'DataType': 5,
      'AllowNull': true,
      'IsComplex': false
    },
    {
      'Name': 'Modified',
      'DataType': 5,
      'AllowNull': true,
      'IsComplex': false
    }
  ],
  'DataStructure': {
    'Children': [
      {
        'Children': [
          {
            'Children': [],
            'Path': 'Load files.Name',
            'Name': 'Name',
            'Type': 0,
            'DataType': 2,
            'InputColumns': [
              'Name',
              'Directory',
              'FullPath',
              'Extension',
              'Surname'
            ]
          },
          {
            'Children': [],
            'Path': 'Load files.Directory',
            'Name': 'Directory',
            'Type': 0,
            'DataType': 2,
            'InputColumns': [
              'Name',
              'Directory',
              'FullPath',
              'Extension'
            ]
          },
          {
            'Children': [],
            'Path': 'Load files.FullPath',
            'Name': 'FullPath',
            'Type': 0,
            'DataType': 2,
            'InputColumns': [
              'Name',
              'Directory',
              'FullPath',
              'Extension'
            ]
          },
          {
            'Children': [],
            'Path': 'Load files.Extension',
            'Name': 'Extension',
            'Type': 0,
            'DataType': 2,
            'InputColumns': [
              'Name',
              'Directory',
              'FullPath',
              'Extension'
            ]
          },
          {
            'Children': [],
            'Path': 'Load files.Data',
            'Name': 'Data',
            'Type': 0,
            'DataType': 4,
            'InputColumns': [
              'Data'
            ]
          },
          {
            'Children': [],
            'Path': 'Load files.Size',
            'Name': 'Size',
            'Type': 0,
            'DataType': 1,
            'InputColumns': [
              'Size'
            ]
          },
          {
            'Children': [],
            'Path': 'Load files.Created',
            'Name': 'Created',
            'Type': 0,
            'DataType': 5,
            'InputColumns': [
              'Created',
              'Modified'
            ]
          },
          {
            'Children': [],
            'Path': 'Load files.Modified',
            'Name': 'Modified',
            'Type': 0,
            'DataType': 5,
            'InputColumns': [
              'Created',
              'Modified'
            ]
          },
          {
            'Children': [
              {
                'Children': [],
                'Path': 'Load files.Third level.Text',
                'Name': 'Text',
                'Type': 0,
                'DataType': 2,
                'InputColumns': [
                  'Name',
                  'Directory',
                  'FullPath',
                  'Extension'
                ]
              },
              {
                'Children': [],
                'Path': 'Load files.Third level.Word',
                'Name': 'Word',
                'Type': 0,
                'DataType': 2,
                'InputColumns': [
                  'Name',
                  'Directory',
                  'FullPath',
                  'Extension'
                ]
              }
            ],
            'Path': 'Load files.Third level',
            'Name': 'Third level',
            'Type': 1,
            'DataType': 7,
            'InputColumns': []
          },
          {
            'Children': [
              {
                'Children': [],
                'Path': 'Load files.Third level second.Text',
                'Name': 'Text',
                'Type': 0,
                'DataType': 2,
                'InputColumns': [
                  'Name',
                  'Directory',
                  'FullPath',
                  'Extension'
                ]
              }
            ],
            'Path': 'Load files.Third level second',
            'Name': 'Third level second',
            'Type': 2,
            'DataType': 7,
            'InputColumns': []
          }
        ],
        'Path': 'Load files',
        'Name': 'Load files',
        'Type': 2,
        'DataType': 7,
        'InputColumns': [
          'Name',
          'Directory',
          'FullPath',
          'Extension'
        ]
      },
      {
        'Children': [
          {
            'Children': [],
            'Path': 'Convert to text.Text',
            'Name': 'Text',
            'Type': 0,
            'DataType': 2,
            'InputColumns': [
              'Name',
              'Directory',
              'FullPath',
              'Extension'
            ]
          },
          {
            'Children': [
              {
                'Children': [],
                'Path': 'Load files.Third level third.Text',
                'Name': 'Text',
                'Type': 0,
                'DataType': 2,
                'InputColumns': [
                  'Name',
                  'Directory',
                  'FullPath',
                  'Extension'
                ]
              }
            ],
            'Path': 'Load files.Third level third',
            'Name': 'Third level third',
            'Type': 2,
            'DataType': 7,
            'InputColumns': [
              'Name',
              'Directory',
              'FullPath',
              'Extension'
            ]
          }
        ],
        'Path': 'Convert to text',
        'Name': 'Convert to text',
        'Type': 2,
        'DataType': 7,
        'InputColumns': []
      }
    ],
    'Path': '*',
    'Name': 'All',
    'Type': 2,
    'DataType': 7,
    'InputColumns': []
  }
};

  MOCK_DATA_LITTLE: IsInputMappingInput = {
    'InputSchema': [
      {
        'Name': 'Name',
        'DataType': 2,
        'AllowNull': false,
        'IsComplex': false
      },
      {
        'Name': 'Directory',
        'DataType': 2,
        'AllowNull': false,
        'IsComplex': false
      },
      {
        'Name': 'FullPath',
        'DataType': 2,
        'AllowNull': false,
        'IsComplex': false
      },
      {
        'Name': 'Extension',
        'DataType': 2,
        'AllowNull': false,
        'IsComplex': false
      },
      {
        'Name': 'Data',
        'DataType': 4,
        'AllowNull': false,
        'IsComplex': false
      },
      {
        'Name': 'Size',
        'DataType': 1,
        'AllowNull': true,
        'IsComplex': false
      },
      {
        'Name': 'Created',
        'DataType': 5,
        'AllowNull': true,
        'IsComplex': false
      },
      {
        'Name': 'Modified',
        'DataType': 5,
        'AllowNull': true,
        'IsComplex': false
      }
    ],
    'DataStructure': {
      'Children': [
        {
          'Children': [
            {
              'Children': [],
              'Path': 'Load files.Name',
              'Name': 'Name',
              'Type': 0,
              'DataType': 2,
              'InputColumns': [
                'Name',
                'Directory',
                'FullPath',
                'Extension'
              ]
            },
            {
              'Children': [],
              'Path': 'Load files.Directory',
              'Name': 'Directory',
              'Description': 'aka folder',
              'Type': 0,
              'DataType': 2,
              'InputColumns': [
                'Name',
                'Directory',
                'FullPath',
                'Extension'
              ]
            },
            {
              'Children': [],
              'Path': 'Load files.FullPath',
              'Name': 'FullPath',
              'Type': 0,
              'DataType': 2,
              'InputColumns': [
                'Name',
                'Directory',
                'FullPath',
                'Extension'
              ]
            },
            {
              'Children': [],
              'Path': 'Load files.Extension',
              'Name': 'Extension',
              'Type': 0,
              'DataType': 2,
              'InputColumns': [
                'Name',
                'Directory',
                'FullPath',
                'Extension'
              ]
            },
            {
              'Children': [],
              'Path': 'Load files.Data',
              'Name': 'Data',
              'Type': 0,
              'DataType': 4,
              'InputColumns': [
                'Data'
              ]
            },
            {
              'Children': [],
              'Path': 'Load files.Json',
              'Name': 'JSON',
              'Type': 0,
              'DataType': 8,
              'InputColumns': [
                'Data'
              ]
            },
            {
              'Children': [],
              'Path': 'Load files.Size',
              'Name': 'Size',
              'Type': 0,
              'DataType': 1,
              'InputColumns': [
                'Size'
              ]
            },
            {
              'Children': [],
              'Path': 'Load files.Created',
              'Name': 'Created',
              'Type': 0,
              'DataType': 5,
              'InputColumns': [
                'Created',
                'Modified'
              ]
            },
            {
              'Children': [],
              'Path': 'Load files.Modified',
              'Name': 'Modified',
              'Type': 0,
              'DataType': 5,
              'InputColumns': [
                'Created',
                'Modified'
              ]
            }
          ],
          'Path': 'Load files',
          'Name': 'Load files',
          'Type': 3,
          'DataType': 7,
          'InputColumns': []
        }
      ],
      'Path': '*',
      'Name': 'All',
      'Type': 2,
      'DataType': 7,
      'InputColumns': []
    }
  };

  formControl = new FormControl();
  currentValue = '';
  filtersAllowed = true;
  validationError = null;
  val: IsInputMappingValue;
  currentDataset = this.MOCK_DATA;

  constructor() { }

  ngOnInit() {
    this.formControl.valueChanges.subscribe((val: IsInputMappingValue) => {
      this.val = val;
      console.log('val', val);
      if (!val) {
        this.currentValue = 'null';
        return;
      }
      if (val.InputSchemaMapping instanceof Map) {
        const m = {};
        val.InputSchemaMapping.forEach((v, k) => m[k] = v);
        val.InputSchemaMapping = m;
      }
      this.validationError = this.formControl.errors === null ? '' : JSON.stringify(this.formControl.errors);
      this.currentValue = JSON.stringify(val);
    });
    // this.formControl.statusChanges.subscribe(() => {
    //   this.validationError = this.formControl.errors === null ? '' : JSON.stringify(this.formControl.errors);
    // });
    this.val = this.formControl.value;
  }

  nullIt() {
    // this example does emit value change event
    // it will be cached in the valueChanges subscription
    this.formControl.setValue(null);
  }

  emptyMap() {
    this.formControl.setValue({InputSchemaMapping: {}});
  }

  modified2Created() {
    // this example does NOT emit value change event
    // we have to cache current value by ourselves
    this.val = {InputSchemaMapping: {'Modified': 'Load files.Created'}, InputSchemaFilter: {}};
    this.currentValue = JSON.stringify(this.val);

    this.formControl.setValue(this.val, {emitEvent: false});
  }

  switchDataset() {
    // this example does emit value change event
    // it will be cached in the valueChanges subscription
    this.currentDataset = this.currentDataset === this.MOCK_DATA_LITTLE ? this.MOCK_DATA : this.MOCK_DATA_LITTLE;
    // this.formControl.setValue(this.val);
    // setTimeout(() => this.formControl.setValue(null));
  }

  deleteDataset() {
    this.currentDataset = undefined;
  }

  toggleDisabled() {
    this.formControl.disabled ? this.formControl.enable() : this.formControl.disable({emitEvent: false});
  }

  filterFullpath() {
    if (!this.val) {
      this.val = {InputSchemaMapping: {}, InputSchemaFilter: {}};
    }
    this.val.InputSchemaFilter['Load files.FullPath'] = [{'Type': 'StringEq', 'Value': 'C:\\Windows\\'}];
    this.formControl.setValue(this.val);
  }

  switchFilters() {
    this.filtersAllowed = !this.filtersAllowed;
  }

  logState() {
    console.log(this.formControl);
  }
}
