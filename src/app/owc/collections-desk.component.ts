import { Component, OnInit, ViewChild } from '@angular/core';
import { NotificationService } from '../notifications';
import { CollectionsService, OwcContext } from './';
import { UserFile, UserMetaRecord, WorkbenchService } from '../workbench';
import { ModalDirective } from 'ngx-bootstrap';
import { OwcContextsRightsMatrix } from '../workbench/workbench.types';
import {
  OwcAuthor, OwcCategory, OwcLink, OwcOffering, OwcResource, OwcResourceLinks,
  OwcResourceProperties
} from './collections';
import { IDashboardCategory } from '../dashboards/categories';

@Component({
  selector: 'app-sac-gwh-collections-desk',
  templateUrl: 'collections-desk.component.html'
})

/**
 * Shows collections of the current user
 */
export class CollectionsDeskComponent implements OnInit {

  @ViewChild('createCollectionModalRef') public createCollectionModal: ModalDirective;
  loading = false;
  editorActive = false;
  fileparseerror = true;
  newdocintro: any = {};
  importOwcDoc: any = {};
  editOwcDoc: OwcContext;
  userFiles: UserFile[] = [];
  userMetaRecords: UserMetaRecord[] = [];

  myCollections: OwcContext[] = [];
  myRightsMatrix: OwcContextsRightsMatrix[] = [];

  // private _myDefaultCollection: OwcContext;

  /**
   * shows the modal
   */
  showCreateCollectionModal() {
    this.createCollectionModal.show();
  }

  /**
   * hides the modal
   */
  hideCreateCollectionModal() {
    this.createCollectionModal.hide();
  }

  reloadCollections(): void {
    this.collectionsService.getCollections()
      .subscribe(
        owcDocs => {
          this.myCollections = [];
          owcDocs.forEach(( owcDoc: OwcContext ) => {
            this.myCollections.push(owcDoc);
            // console.log(owcDoc.id);
          });
          this.notificationService.addNotification({
            id: NotificationService.DEFAULT_DISMISS,
            type: 'info',
            message: `The collections have been reloaded.`
          });
        },
        error => {
          console.log(<any>error);
          this.notificationService.addErrorResultNotification(error);
        });

    this.workbenchService.getOwcContextsRightsMatrixForUser()
      .subscribe(
        rights => {
          this.myRightsMatrix = [];
          rights.forEach(( matrix: OwcContextsRightsMatrix ) => {
            this.myRightsMatrix.push(matrix);
            // console.log(matrix);
          });
        },
        error => {
          console.log(<any>error);
          this.notificationService.addErrorResultNotification(error);
        });

    // this.collectionsService.getDefaultCollection()
    //   .subscribe(
    //     owcDoc => {
    //       this._myDefaultCollection = owcDoc;
    //       // this.notificationService.addNotification({
    //       //   id: NotificationService.DEFAULT_DISMISS,
    //       //   type: 'info',
    //       //   message: 'The default collections has been reloaded.'
    //       // });
    //     },
    //     error => {
    //       console.log(<any>error);
    //       this.notificationService.addErrorResultNotification(error);
    //     });
  }

  onReturnCloseEditor(): void {
    this.editorActive = false;
  }

  onEditCollectionRequest( $event: any ) {
    // console.log($event.data);
    if ($event.data && <OwcContext>$event.data) {
      this.editOwcDoc = <OwcContext>$event.data;
      this.editorActive = true;
    } else {
      this.notificationService.addNotification({
        id: NotificationService.DEFAULT_DISMISS,
        type: 'error',
        message: `No data arrived error.`
      });
    }
  }

  /**
   * shouldn't trust the client I guess, request fresh empty custom collection and adds initial edits
   * @param {string} title
   * @param {string} subtitle
   */
  createCollection( title: string, subtitle: string ): void {
    const templateUuid = this.collectionsService.getNewUuid();
    const id = 'https://portal.smart-project.info/context/user/' + templateUuid;
    // console.log('we create a new collection: ' + id);
    this.collectionsService.createNewCustomCollection()
      .subscribe(
        owcDoc => {
          // this.myCollections.push(owcDoc);
          let newDoc = owcDoc;
          newDoc.properties.title = title;
          newDoc.properties.subtitle = subtitle;
          // console.log(owcDoc);
          this.collectionsService.updateCollection(newDoc)
            .subscribe(
              updatedDoc => {
                this.notificationService.addNotification({
                  id: NotificationService.DEFAULT_DISMISS,
                  type: 'info',
                  message: 'A new custom collection has been created and added to your data.',
                  details: `Created a new collection, ${id}`
                });
                this.hideCreateCollectionModal();
                this.reloadCollections();
              },
              error => {
                console.log(<any>error);
                this.notificationService.addErrorResultNotification(error);
              });
        },
        error => {
          console.log(<any>error);
          this.notificationService.addErrorResultNotification(error);
        });
  }

  /**
   * tries to load the selected file as JSON as OwcContext
   * @param event
   */
  testImportJsonFile( event: Event ): void {
    let files = event.target[ 'files' ];
    // console.log(files);
    try {
      let reader = new FileReader();
      reader.readAsText(files[ 0 ]);
      reader.onload = ( e ) => {
        let owcDoc: OwcContext = <OwcContext>JSON.parse(reader.result);
        this.fileparseerror = false;
        this.importOwcDoc = owcDoc;
      };
      reader.onerror = ( e ) => {
        console.log(e);
        this.notificationService.addNotification({
          id: NotificationService.DEFAULT_DISMISS,
          type: 'danger',
          message: 'An error has occured while reading the file',
          details: e.message
        });
      };
    } catch (ex) {
      console.log(ex);
      this.notificationService.addNotification({
        id: NotificationService.DEFAULT_DISMISS,
        type: 'danger',
        message: 'An error has occuredm this file is not compatible',
        details: `${JSON.stringify(ex)}`
      });
    }
  }

  /**
   * import a new Collection From GeoJSON File (and for security/collisions reasons make deep identifier-safe copy)
   * @param owcdoc
   */
  importCollectionFromFile( owcdoc: OwcContext ): void {
    // console.log(owcdoc);
    this.collectionsService.insertCopyOfCollection(owcdoc)
      .subscribe(
        insertedDoc => {
          this.notificationService.addNotification({
            id: NotificationService.DEFAULT_DISMISS,
            type: 'info',
            message: `A new custom collection has been created and added to your data.`,
            details: `Created a new collection, ${insertedDoc.id}`
          });
          this.hideCreateCollectionModal();
          this.reloadCollections();
        },
        error => {
          console.log(<any>error);
          this.notificationService.addErrorResultNotification(error);
        });
  }

  findVisibilityForCollection( collectionid: string ): OwcContextsRightsMatrix | void {
    return this.myRightsMatrix.find(r => r.owcContextId === collectionid);
  }

  /**
   * Constructor
   * @param {CollectionsService} collectionsService
   * @param {WorkbenchService} workbenchService
   * @param {NotificationService} notificationService
   */
  constructor( private collectionsService: CollectionsService,
               private workbenchService: WorkbenchService,
               private notificationService: NotificationService ) {
  }

  /**
   * OnInit - load current user's collections
   */
  ngOnInit(): void {
    // get owcDoc from secure api end point
    // this.collectionsService.getDefaultCollection()
    //   .subscribe(
    //     owcDoc => {
    //       this._myDefaultCollection = owcDoc;
    //     },
    //     error => {
    //       console.log(<any>error);
    //       this.notificationService.addErrorResultNotification(error);
    //     });

    this.workbenchService.getOwcContextsRightsMatrixForUser()
      .subscribe(
        rights => {
          rights.forEach(( matrix: OwcContextsRightsMatrix ) => {
            this.myRightsMatrix.push(matrix);
            // console.log(matrix);
          });
        },
        error => {
          console.log(<any>error);
          this.notificationService.addErrorResultNotification(error);
        });

    this.collectionsService.getCollections()
      .subscribe(
        owcDocs => {
          owcDocs.forEach(( owcDoc: OwcContext ) => {
            this.myCollections.push(owcDoc);
            // console.log(owcDoc.id);
          });
        },
        error => {
          console.log(<any>error);
          this.notificationService.addErrorResultNotification(error);
        });

    // FIXME det muss wieder raus
    // let contexts = this.generateNZmapcontexts();
    // console.log(JSON.stringify(contexts));
    // contexts.forEach(owc => this.myCollections.push(owc));
  }

  generateNZmapcontexts(): OwcContext[] {
    // FIXME det muss wieder raus
    let geoserverURL_local = 'https://portal.smart-project.info/geoserver/wms';
    let linzwms_URL_new = 'https://data.linz.govt.nz/services;key=a8fb9bcd52684b7abe14dd4664ce9df9/wms';
    let lriswms_URL_new = 'https://lris.scinfo.org.nz/services;key=7c49be26da404042b2d0736595e64952/wms';

    let gnsqmapwms_URL = 'https://maps.gns.cri.nz/geology/wms';

    let earth2observe_URL = 'https://wci.earth2observe.eu/thredds/wms/deltares/aet-pet/MOD16_PET_corr_monthly_2000_2013.nc';
    let earth2observe_URL2 = 'https://wci.earth2observe.eu/thredds/wms/deltares/aet-pet/MOD16_AET_corr_monthly_2000_2013.nc';

    let geoserverURL_awahou = 'https://portal.smart-project.info/geoserver/wms';

    // geoserver workspace
    let namespace_local = 'horowhenua_ws';
    // geoserver workspace
    let namespace_awahou = 'horowhenua_ws';

    let imageFolder = 'https://portal.smart-project.info/fs/images';

    let projWGS = 'EPSG:4326';

    interface OverLaySpec {
      id: string;
      catalog_uid?: string;
      title: string;
      geoserverURL: string;
      workspace: string;
      name: string;
      children: string;
      visible?: boolean;
      opacity?: number;
    }

    interface MapSpec {
      id: string;
      name: string;
      parent?: string;
      bounds?: number[];
      image?: string;
      children?: MapSpec[];
      overlays?: OverLaySpec[];
    }

    let mapContextSpecs: MapSpec[] = [

      { id: 'nz', name: 'New Zealand', parent: null, bounds: [ 164, -48, 180, -33 ], image: imageFolder + '/nz_m.png' },
      { id: 'nz_overview', name: 'Overview', parent: 'nz' },
      { id: 'nz_other', name: 'Other Databases', parent: 'nz' },

      {
        id: 'ho',
        name: 'Horowhenua',
        parent: null,
        bounds: [ 175, -40.8, 175.5, -40.4 ],
        image: imageFolder + '/horizons_m.png'
      },
      { id: 'ho_base_info', name: 'Base info', parent: 'ho' },
      { id: 'ho_hydro', name: 'Hydrology', parent: 'ho' },
      { id: 'ho_geology', name: 'Geology and Landuse', parent: 'ho' },

      {
        id: 'ng',
        name: 'Ngongotha DTS',
        parent: null,
        bounds: [ 176.1, -38.15, 176.2, -38.1 ],
        image: imageFolder + '/DTS_banner.png'
      },
      { id: 'ng_dts_exp', name: 'DTS Experiment (Ngongotaha Valley)', parent: 'ng' },

      {
        id: 'sac',
        name: 'SMART Case Studies',
        parent: null,
        bounds: [ 164, -48, 180, -33 ],
        image: imageFolder + '/nz_m.png'
      },
      { id: 'sac_add', name: 'Informative Layers', parent: 'sac' },
      { id: 'sac_geophys', name: 'Sel. Geophysics', parent: 'sac' },
      { id: 'sac_dts', name: 'GW-SW Interaction, FODTS', parent: 'sac' },
      { id: 'sac_tracers', name: 'Novel Tracers', parent: 'sac' },
      { id: 'sac_datavis', name: 'DataVis and SOS', parent: 'sac' },

      {
        id: 'awa',
        name: 'Awahou Catchment',
        parent: null,
        bounds: [ 176.1, -38.11, 176.3, -37.97 ],
        image: imageFolder + '/nz_m.png'
      },
      { id: 'awa_catch', name: 'Awahou Catchment', parent: 'awa' },
      { id: 'awa_add', name: 'Informative Layers', parent: 'awa' }

    ];

    let overlaySpecs = [
      {
        id: '1',
        catalog_uid: '',
        title: 'Linz NZ Terrain Relief (Topo50)',
        geoserverURL: linzwms_URL_new,
        workspace: '',
        name: 'layer-50765',
        children: 'nz_other',
        visible: false,
        opacity: .90
      },
      {
        id: '1',
        catalog_uid: '',
        title: 'Linz NZ Mainland Topo50',
        geoserverURL: linzwms_URL_new,
        workspace: '',
        name: 'layer-50767',
        children: 'nz_other',
        visible: false,
        opacity: .90
      },
      {
        id: '1',
        catalog_uid: '',
        title: 'NZ GNS QMAP',
        geoserverURL: gnsqmapwms_URL,
        workspace: 'gns',
        name: 'NZL_GNS_1M_Lithostratigraphy',
        children: 'nz_other',
        visible: false,
        opacity: .80
      },
      {
        id: '1',
        catalog_uid: '',
        title: 'NZ DTM 100x100',
        geoserverURL: geoserverURL_local,
        workspace: namespace_local,
        name: 'nz-dtm-100x100',
        children: 'nz_other',
        visible: false,
        opacity: .80
      },
      {
        id: '1',
        catalog_uid: '',
        title: 'Equilibrium Water Table',
        geoserverURL: geoserverURL_local,
        workspace: namespace_local,
        name: 'ewt_nzprj_new',
        children: 'nz_geophys',
        visible: false,
        opacity: .60
      },
      {
        id: '1',
        catalog_uid: '',
        title: 'Monthly Potential Evapotranspiration (PET)',
        geoserverURL: earth2observe_URL,
        workspace: '',
        name: 'PET',
        children: 'nz_geophys',
        visible: false,
        opacity: .80
      },
      {
        id: '1',
        catalog_uid: '',
        title: 'PET Uncertainty',
        geoserverURL: earth2observe_URL,
        workspace: '',
        name: 'Uncertainty',
        children: 'nz_geophys',
        visible: false,
        opacity: .80
      },
      {
        id: '1',
        catalog_uid: '',
        title: 'NZ Aquifers (White 2001)',
        geoserverURL: geoserverURL_local,
        workspace: namespace_local,
        name: 'nz_aquifers',
        children: 'nz_other',
        visible: false,
        opacity: .50
      },
      {
        id: '1',
        catalog_uid: '',
        title: 'New Zealand regions',
        geoserverURL: geoserverURL_local,
        workspace: namespace_local,
        name: 'nz_regions',
        children: 'nz_other',
        visible: true,
        opacity: .60
      },
      {
        id: '1',
        catalog_uid: '',
        title: 'DTS Cable Position(Ngongotaha Valley)',
        geoserverURL: geoserverURL_local,
        workspace: namespace_local,
        name: 'DTS_Cable_Position',
        children: 'nz_other',
        visible: false,
        opacity: 1
      },
      {
        id: '1',
        catalog_uid: '',
        title: 'Matata geological model',
        geoserverURL: geoserverURL_local,
        workspace: namespace_local,
        name: 'matata_model',
        children: 'nz_overview',
        visible: false,
        opacity: .50
      },
      {
        id: '1',
        catalog_uid: '',
        title: 'Tauranga geological model',
        geoserverURL: geoserverURL_local,
        workspace: namespace_local,
        name: 'tauranga_model',
        children: 'nz_overview',
        visible: false,
        opacity: .50
      },
      {
        id: '1',
        catalog_uid: '',
        title: 'Rotorua geological model',
        geoserverURL: geoserverURL_local,
        workspace: namespace_local,
        name: 'rotorua_model',
        children: 'nz_overview',
        visible: false,
        opacity: .50
      },
      {
        id: '1',
        catalog_uid: '',
        title: 'Rangitaiki geological model',
        geoserverURL: geoserverURL_local,
        workspace: namespace_local,
        name: 'rangitaiki_model',
        children: 'nz_overview',
        visible: false,
        opacity: .50
      },
      {
        id: '1',
        catalog_uid: '',
        title: 'Horowhenua Area',
        geoserverURL: geoserverURL_local,
        workspace: namespace_local,
        name: 'study_area',
        children: 'nz_overview',
        visible: false,
        opacity: .70
      },
      {
        id: '1',
        catalog_uid: '',
        title: 'NGMP Sites',
        geoserverURL: geoserverURL_local,
        workspace: namespace_local,
        name: 'ngmp-locations',
        children: 'nz_overview',
        visible: true,
        opacity: 1.00
      },
      {
        id: '2',
        title: 'Linz NZ Terrain Relief (Topo50)',
        geoserverURL: linzwms_URL_new,
        workspace: '',
        name: 'layer-50765',
        children: 'ho_geology',
        visible: false,
        opacity: .90
      },
      {
        id: '2',
        title: 'Linz NZ Mainland Topo50',
        geoserverURL: linzwms_URL_new,
        workspace: '',
        name: 'layer-50767',
        children: 'ho_geology',
        visible: false,
        opacity: .90
      },
      {
        id: '2',
        title: 'NZ DTM 100x100',
        geoserverURL: geoserverURL_local,
        workspace: namespace_local,
        name: 'nz-dtm-100x100',
        children: 'ho_geology',
        visible: false,
        opacity: .80
      },
      {
        id: '2',
        title: 'NZ GNS QMAP',
        geoserverURL: gnsqmapwms_URL,
        workspace: 'gns',
        name: 'NZL_GNS_1M_Lithostratigraphy',
        children: 'ho_geology',
        visible: false,
        opacity: .80
      },
      {
        id: '2',
        title: 'Equilibrium Water Table',
        geoserverURL: geoserverURL_local,
        workspace: namespace_local,
        name: 'ewt_nzprj_new',
        children: 'ho_hydro',
        visible: false,
        opacity: .60
      },
      {
        id: '2',
        title: 'Holocene_top_100',
        geoserverURL: geoserverURL_local,
        workspace: namespace_local,
        name: 'Holocene_top_100_horo',
        children: 'ho_geology',
        visible: false,
        opacity: .50
      },
      {
        id: '2',
        title: 'Q2Q3Q4_top_100',
        geoserverURL: geoserverURL_local,
        workspace: namespace_local,
        name: 'Q2Q3Q4_top_100_horo',
        children: 'ho_geology',
        visible: false,
        opacity: .50
      },
      {
        id: '2',
        title: 'Q5_top_100',
        geoserverURL: geoserverURL_local,
        workspace: namespace_local,
        name: 'Q5_top_100_horo',
        children: 'ho_geology',
        visible: false,
        opacity: .50
      },
      {
        id: '2',
        title: 'Q6_top_100',
        geoserverURL: geoserverURL_local,
        workspace: namespace_local,
        name: 'Q6_top_100_horo',
        children: 'ho_geology',
        visible: false,
        opacity: .50
      },
      {
        id: '2',
        title: 'Greywacke_top_100',
        geoserverURL: geoserverURL_local,
        workspace: namespace_local,
        name: 'Greywacke_top_100_horo',
        children: 'ho_geology',
        visible: false,
        opacity: .50
      },
      {
        id: '2',
        title: 'Study Area',
        geoserverURL: geoserverURL_local,
        workspace: namespace_local,
        name: 'study_area',
        children: 'ho_base_info',
        visible: true,
        opacity: .70
      },
      {
        id: '2',
        title: 'Soil Groups',
        geoserverURL: geoserverURL_local,
        workspace: namespace_local,
        name: 'howrowhenua_9soils',
        children: 'ho_geology',
        visible: false,
        opacity: .70
      },
      {
        id: '2',
        title: 'Landuse',
        geoserverURL: geoserverURL_local,
        workspace: namespace_local,
        name: 'horowhenua_landuse',
        children: 'ho_geology',
        visible: false,
        opacity: .70
      },
      {
        id: '2',
        title: 'QMAP Clip',
        geoserverURL: geoserverURL_local,
        workspace: namespace_local,
        name: 'qmap_clip',
        children: 'ho_geology',
        visible: false,
        opacity: .70
      },
      {
        id: '2',
        title: 'Groundwater Catchments',
        geoserverURL: geoserverURL_local,
        workspace: namespace_local,
        name: 'catchments',
        children: 'ho_base_info',
        visible: true,
        opacity: .80
      },
      {
        id: '2',
        title: 'Lakes',
        geoserverURL: geoserverURL_local,
        workspace: namespace_local,
        name: 'lakes',
        children: 'ho_base_info',
        visible: true,
        opacity: 1.00
      },
      {
        id: '2',
        title: 'Rivers/Streams',
        geoserverURL: geoserverURL_local,
        workspace: namespace_local,
        name: 'rivers',
        children: 'ho_base_info',
        visible: false,
        opacity: 1.00
      },

      {
        id: '2',
        title: 'gaining/loosing, sel. rivers',
        geoserverURL: geoserverURL_local,
        workspace: namespace_local,
        name: 'river_gaining_loosing',
        children: 'ho_hydro',
        visible: false,
        opacity: 1.00
      },
      {
        id: '2',
        title: 'Mean rainfall contours',
        geoserverURL: geoserverURL_local,
        workspace: namespace_local,
        name: 'horowhenua_mean_rainfall_contours',
        children: 'ho_hydro',
        visible: false,
        opacity: .80
      },
      {
        id: '2',
        title: 'Evaporation contours',
        geoserverURL: geoserverURL_local,
        workspace: namespace_local,
        name: 'evaporation_contours',
        children: 'ho_hydro',
        visible: false,
        opacity: .80
      },
      {
        id: '2',
        title: 'GW level contours',
        geoserverURL: geoserverURL_local,
        workspace: namespace_local,
        name: 'groundwater_level_contours',
        children: 'ho_hydro',
        visible: false,
        opacity: 1.00
      },
      {
        id: '2',
        title: 'Springs',
        geoserverURL: geoserverURL_local,
        workspace: namespace_local,
        name: 'Horowhenua_springs',
        children: 'ho_base_info',
        visible: false,
        opacity: 1.00
      },
      {
        id: '2',
        title: 'general Wells',
        geoserverURL: geoserverURL_local,
        workspace: namespace_local,
        name: 'wells',
        children: 'ho_base_info',
        visible: false,
        opacity: 1.00
      },
      {
        id: '2',
        title: 'Surface water measurements',
        geoserverURL: geoserverURL_local,
        workspace: namespace_local,
        name: 'surface_waterpoints',
        children: 'ho_hydro',
        visible: false,
        opacity: 1.00
      },
      {
        id: '2',
        title: 'Waikawa Lakes subdivision piezometers',
        geoserverURL: geoserverURL_local,
        workspace: namespace_local,
        name: 'waikawa_subdivision_piezometers',
        children: 'ho_hydro',
        visible: false,
        opacity: 1.00
      },
      {
        id: '2',
        title: 'Groundwater level measurements',
        geoserverURL: geoserverURL_local,
        workspace: namespace_local,
        name: 'groundwater_level_measurements',
        children: 'ho_hydro',
        visible: false,
        opacity: 1.00
      },
      {
        id: '2',
        title: 'SoE gwl monitoring wells',
        geoserverURL: geoserverURL_local,
        workspace: namespace_local,
        name: 'soe_gwl_monitoring_wells',
        children: 'ho_hydro',
        visible: true,
        opacity: 1.00
      },
      {
        id: '3',
        title: 'Linz NZ Terrain Relief (Topo50)',
        geoserverURL: linzwms_URL_new,
        workspace: '',
        name: 'layer-50765',
        children: 'ng_dts_exp',
        visible: false,
        opacity: .90
      },
      {
        id: '3',
        title: 'Linz NZ Mainland Topo50',
        geoserverURL: linzwms_URL_new,
        workspace: '',
        name: 'layer-50767',
        children: 'ng_dts_exp',
        visible: false,
        opacity: .90
      },
      {
        id: '3',
        title: 'NZ DTM 100x100',
        geoserverURL: geoserverURL_local,
        workspace: namespace_local,
        name: 'nz-dtm-100x100',
        children: 'ng_dts_exp',
        visible: false,
        opacity: .80
      },
      {
        id: '3',
        title: 'Equilibrium Water Table',
        geoserverURL: geoserverURL_local,
        workspace: namespace_local,
        name: 'ewt_nzprj_new',
        children: 'ng_dts_exp',
        visible: false,
        opacity: .60
      },
      {
        id: '3',
        title: 'NZ Aquifers (White 2001)',
        geoserverURL: geoserverURL_local,
        workspace: namespace_local,
        name: 'nz_aquifers',
        children: 'ng_dts_exp',
        visible: false,
        opacity: .50
      },
      {
        id: '3',
        title: 'DTS Cable Position(Ngongotaha Valley)',
        geoserverURL: geoserverURL_local,
        workspace: namespace_local,
        name: 'DTS_Cable_Position',
        children: 'ng_dts_exp',
        visible: true,
        opacity: 1.00
      },
      {
        id: '3',
        title: 'Rotorua geological model',
        geoserverURL: geoserverURL_local,
        workspace: namespace_local,
        name: 'rotorua_model',
        children: 'ng_dts_exp',
        visible: true,
        opacity: .20
      },
      {
        id: '4',
        catalog_uid: '',
        title: 'NGMP Sites',
        geoserverURL: geoserverURL_local,
        workspace: namespace_local,
        name: 'ngmp-locations',
        children: 'sac_add',
        visible: false,
        opacity: 1.00
      },
      {
        id: '4',
        catalog_uid: '',
        title: 'NZ Aquifers (White 2001)',
        geoserverURL: geoserverURL_local,
        workspace: namespace_local,
        name: 'nz_aquifers',
        children: 'sac_add',
        visible: false,
        opacity: .50
      },
      {
        id: '4',
        catalog_uid: '',
        title: 'New Zealand regions',
        geoserverURL: geoserverURL_local,
        workspace: namespace_local,
        name: 'nz_regions',
        children: 'sac_add',
        visible: false,
        opacity: .70
      },
      {
        id: '4',
        catalog_uid: '',
        title: 'NZ DTM 100x100',
        geoserverURL: geoserverURL_local,
        workspace: namespace_local,
        name: 'nz-dtm-100x100',
        children: 'sac_add',
        visible: false,
        opacity: .70
      },
      {
        id: '4',
        catalog_uid: '',
        title: 'Equilibrium Water Table (NZ)',
        geoserverURL: geoserverURL_local,
        workspace: namespace_local,
        name: 'ewt_nzprj_new',
        children: 'sac_geophys',
        visible: false,
        opacity: .60
      },
      {
        id: '4',
        catalog_uid: '',
        title: 'Monthly Potential Evapotranspiration (NZ)',
        geoserverURL: earth2observe_URL,
        workspace: '',
        name: 'PET',
        children: 'sac_geophys',
        visible: false,
        opacity: .60
      },
      {
        id: '4',
        catalog_uid: '',
        title: 'PET Uncertainty (NZ)',
        geoserverURL: earth2observe_URL,
        workspace: '',
        name: 'Uncertainty',
        children: 'sac_geophys',
        visible: false,
        opacity: .70
      },
      {
        id: '4',
        catalog_uid: '',
        title: 'Hawkes Bay',
        geoserverURL: geoserverURL_local,
        workspace: namespace_local,
        name: 'HawkesBay_geophys',
        children: 'sac_geophys',
        visible: true,
        opacity: .80
      },
      {
        id: '4',
        catalog_uid: '',
        title: 'Canterbury',
        geoserverURL: geoserverURL_local,
        workspace: namespace_local,
        name: 'canterbury_region',
        children: 'sac_geophys',
        visible: true,
        opacity: .80
      },
      {
        id: '4',
        catalog_uid: '',
        title: 'Horizons Tararua',
        geoserverURL: geoserverURL_local,
        workspace: namespace_local,
        name: 'Horizons_Tararua',
        children: 'sac_geophys',
        visible: true,
        opacity: .80
      },
      {
        id: '4',
        catalog_uid: '',
        title: 'Otago EM',
        geoserverURL: geoserverURL_local,
        workspace: namespace_local,
        name: 'OtagoEM',
        children: 'sac_geophys',
        visible: true,
        opacity: .80
      },
      {
        id: '4',
        catalog_uid: '',
        title: 'Waipa Catchment',
        geoserverURL: geoserverURL_local,
        workspace: namespace_local,
        name: 'waipa_catchment',
        children: 'sac_geophys',
        visible: true,
        opacity: .80
      },
      {
        id: '4',
        catalog_uid: '',
        title: 'FODTS Testsites',
        geoserverURL: geoserverURL_local,
        workspace: namespace_local,
        name: 'FODTS-Testsites',
        children: 'sac_dts',
        visible: true,
        opacity: .80
      },
      {
        id: '4',
        catalog_uid: '',
        title: 'Halon-1301 Sampling Sites',
        geoserverURL: geoserverURL_local,
        workspace: namespace_local,
        name: 'hutt_halon_sites',
        children: 'sac_tracers',
        visible: true,
        opacity: .80
      },
      {
        id: '4',
        catalog_uid: '',
        title: 'Horowhenua Area (3D)',
        geoserverURL: geoserverURL_local,
        workspace: namespace_local,
        name: 'study_area',
        children: 'sac_datavis',
        visible: true,
        opacity: .80
      },

      {
        id: '5',
        catalog_uid: '',
        title: 'Linz NZ Terrain Relief (Topo50)',
        geoserverURL: linzwms_URL_new,
        workspace: '',
        name: 'layer-50765',
        children: 'awa_add',
        visible: false,
        opacity: .90
      },
      {
        id: '5',
        catalog_uid: '',
        title: 'NZ DTM 100x100',
        geoserverURL: geoserverURL_local,
        workspace: namespace_local,
        name: 'nz-dtm-100x100',
        children: 'awa_add',
        visible: false,
        opacity: .80
      },
      {
        id: '5',
        catalog_uid: '',
        title: 'NZ GNS QMAP',
        geoserverURL: gnsqmapwms_URL,
        workspace: 'gns',
        name: 'NZL_GNS_1M_Lithostratigraphy',
        children: 'awa_add',
        visible: false,
        opacity: .80
      },
      {
        id: '5',
        catalog_uid: '',
        title: 'NZ Aquifers (White 2001)',
        geoserverURL: geoserverURL_local,
        workspace: namespace_local,
        name: 'nz_aquifers',
        children: 'awa_add',
        visible: false,
        opacity: .50
      },
      {
        id: '5',
        catalog_uid: '',
        title: 'Rotorua geological model (GNS)',
        geoserverURL: geoserverURL_local,
        workspace: namespace_local,
        name: 'rotorua_model',
        children: 'awa_add',
        visible: false,
        opacity: .50
      },
      {
        id: '5',
        catalog_uid: '',
        title: 'Lake Rotorua Sub Catchments (June 2014)',
        geoserverURL: geoserverURL_awahou,
        workspace: namespace_awahou,
        name: 'Rotorua_subcatchments',
        children: 'awa_catch',
        visible: false,
        opacity: .70
      },
      {
        id: '5',
        catalog_uid: '',
        title: 'QMAP geology, clipped',
        geoserverURL: geoserverURL_awahou,
        workspace: namespace_awahou,
        name: 'QMAP_clips',
        children: 'awa_catch',
        visible: false,
        opacity: .70
      },
      {
        id: '5',
        catalog_uid: '',
        title: 'Awahou Stream Catchment (June 2014)',
        geoserverURL: geoserverURL_awahou,
        workspace: namespace_awahou,
        name: 'AwahouCatchment',
        children: 'awa_catch',
        visible: false,
        opacity: 1.00
      },
      {
        id: '5',
        catalog_uid: '',
        title: 'Awahou Groundwater Catchment (June 2014)',
        geoserverURL: geoserverURL_awahou,
        workspace: namespace_awahou,
        name: 'GW_Awahou_1_10000_9_June_2014',
        children: 'awa_catch',
        visible: true,
        opacity: .60
      },
      {
        id: '5',
        catalog_uid: '',
        title: 'Hamurana Springs',
        geoserverURL: geoserverURL_awahou,
        workspace: namespace_awahou,
        name: 'Hamurana_Springs',
        children: 'awa_catch',
        visible: true,
        opacity: 1.00
      },
      {
        id: '5',
        catalog_uid: '',
        title: 'Taniwha Springs',
        geoserverURL: geoserverURL_awahou,
        workspace: namespace_awahou,
        name: 'Taniwha_Spring',
        children: 'awa_catch',
        visible: true,
        opacity: 1.00
      },
      {
        id: '5',
        catalog_uid: '',
        title: 'Monitoring Bores (Dewhurst 1996)',
        geoserverURL: geoserverURL_awahou,
        workspace: namespace_awahou,
        name: 'Bores_Dewhurst1996',
        children: 'awa_catch',
        visible: true,
        opacity: 1.00
      },
      {
        id: '5',
        catalog_uid: '',
        title: 'Consented Takes',
        geoserverURL: geoserverURL_awahou,
        workspace: namespace_awahou,
        name: 'ConsentedTakes',
        children: 'awa_catch',
        visible: true,
        opacity: 1.00
      },
      {
        id: '5',
        catalog_uid: '',
        title: 'BOPRC SW quality sites',
        geoserverURL: geoserverURL_awahou,
        workspace: namespace_awahou,
        name: 'BOPRC_SW_sites',
        children: 'awa_catch',
        visible: true,
        opacity: 1.00
      },
      {
        id: '5',
        catalog_uid: '',
        title: 'BOPRC SW flow sites',
        geoserverURL: geoserverURL_awahou,
        workspace: namespace_awahou,
        name: 'BOPRC_SWflow',
        children: 'awa_catch',
        visible: true,
        opacity: 1.00
      },
      {
        id: '5',
        catalog_uid: '',
        title: 'Mean Residence Times',
        geoserverURL: geoserverURL_awahou,
        workspace: namespace_awahou,
        name: 'MRT',
        children: 'awa_catch',
        visible: true,
        opacity: 1.00
      },
      {
        id: '5',
        catalog_uid: '',
        title: 'NGMP Sites',
        geoserverURL: geoserverURL_local,
        workspace: namespace_local,
        name: 'ngmp-locations',
        children: 'awa_add',
        visible: true,
        opacity: 1.00
      }

    ];

    // stack frame one level
    let stack: MapSpec[] = [];
    mapContextSpecs.forEach(item => {
      if (!item.parent) {
        // console.log(item);
        let t = item;
        t.children = [];
        stack.push(item);
      } else {
        stack = stack.map(par => {
          if (par.id === item.parent) {
            item.overlays = [];
            item.overlays = overlaySpecs.filter(o => o.children === item.id);
            par.children.push(item);
          }
          return par;
        });
      }
    });

    const defaultauthor = <OwcAuthor>{
      'name': 'Alex Kmoch',
      'email': 'allixender@gmail.com',
      'uri': 'https://portal.smart-project.info'
    };
    const defaultProfileLink = <OwcLink>{
      'href': 'http://www.opengis.net/spec/owc-geojson/1.0/req/core',
      'rel': 'profile'
    };

    let newContexts: OwcContext[] = stack.map(mapSpec => {
      let uuid = this.collectionsService.getNewUuid();
      let viewParentCategory = <OwcCategory> {
        'scheme': 'view-groups',
        'term': mapSpec.id,
        'label': mapSpec.name
      };
      let child_names: string = mapSpec.children.map(c => c.name).join(' ');
      let owcPrep = <OwcContext> {
        'type': 'FeatureCollection',
        'id': 'https://portal.smart-project.info/context/document/' + uuid,
        'bbox': mapSpec.bounds,
        'properties': {
          'links': {
            'profiles': [ defaultProfileLink ],
            'via': [ <OwcLink>{
              'href': 'https://portal.smart-project.info/context/document/' + uuid,
              'rel': 'via'
            } ]
          },
          'lang': 'en',
          'title': mapSpec.name,
          'subtitle': child_names,
          'updated': '2018-02-16T04:14:56.884Z',
          'generator': {
            'title': 'Groundwater Hub'
          },
          'authors': [ defaultauthor ],
          'publisher': 'GNS Science',
          'rights': 'CC BY SA 4.0 NZ',
          'categories': [ viewParentCategory ]
        },
        'features': []
      };

      let stackedResources: OwcResource[][] = mapSpec.children.map(( subCategorySpec: MapSpec ) => {
        let owcResources: OwcResource[] = subCategorySpec.overlays.map(( overLay: OverLaySpec ) => {
          let viewCategory = <OwcCategory> {
            'scheme': 'view-groups',
            'term': subCategorySpec.id,
            'label': subCategorySpec.name
          };
          let res_uuid = this.collectionsService.getNewUuid();
          let fullLayer = overLay.workspace ? overLay.workspace + ':' + overLay.name : overLay.name;
          const imageUrl = mapSpec.image;
          const minX = mapSpec.bounds[ 0 ];
          const minY = mapSpec.bounds[ 1 ];
          const maxX = mapSpec.bounds[ 2 ];
          const maxY = mapSpec.bounds[ 3 ];
          let defaultWmsOffering = <OwcOffering> {
            code: 'http://www.opengis.net/spec/owc-geojson/1.0/req/wms',
            operations: [
              {
                code: 'GetCapabilities',
                method: 'GET',
                type: 'application/xml',
                href: overLay.geoserverURL + '?VERSION=1.3.0&REQUEST=GetCapabilities'
              },
              {
                code: 'GetMap',
                method: 'GET',
                type: 'image/png',
                href: overLay.geoserverURL + `?VERSION=1.3&REQUEST=GetMap&SRS=EPSG:4326` +
                `&BBOX=${minX},${minY},${maxX},${maxY}&WIDTH=800&HEIGHT=600&LAYERS=${fullLayer}&FORMAT=image/png` +
                `&TRANSPARENT=TRUE&EXCEPTIONS=application/vnd.ogc.se_xml`
              }
            ],
            contents: [],
            styles: []
          };
          let fakeCswOffering = <OwcOffering> {
            code: 'http://www.opengis.net/spec/owc-geojson/1.0/req/csw',
            operations: [
              {
                code: 'GetCapabilities',
                method: 'GET',
                type: 'application/xml',
                href: 'https://portal.smart-project.info/pycsw/csw?SERVICE=CSW&VERSION=2.0.2&REQUEST=GetCapabilities'
              },
              {
                code: 'GetRecordById',
                method: 'POST',
                type: 'application/xml',
                href: `https://portal.smart-project.info/journalcsw/journalcsw?request=GetRecordById&version=2.0.2` +
                `&service=CSW&elementSetName=full&outputSchema=http%3A%2F%2Fwww.isotc211.org%2F2005%2Fgmd&Id=${overLay.catalog_uid}`
              }
            ],
            contents: []
          };
          let offeringsList = geoserverURL_local.includes('smart-project') ?
            [ defaultWmsOffering, fakeCswOffering ] : [ defaultWmsOffering ];

          let myResource = <OwcResource> {
            type: 'Feature',
            id: 'https://portal.smart-project.info/context/resource/' + res_uuid,
            geometry: {
              'type': 'Polygon',
              'coordinates': [
                [
                  [
                    minX,
                    minY
                  ],
                  [
                    maxX,
                    minY
                  ],
                  [
                    maxX,
                    maxY
                  ],
                  [
                    minX,
                    maxY
                  ],
                  [
                    minX,
                    minY
                  ]
                ]
              ]
            },
            properties: <OwcResourceProperties> {
              title: fullLayer,
              abstract: overLay.title,
              updated: '2018-02-16T04:14:56.884Z',
              authors: [ defaultauthor ],
              publisher: 'GNS Science',
              rights: 'CC BY SA 4.0 NZ',
              links: <OwcResourceLinks> {
                alternates: [],
                previews: [ <OwcLink>{
                  'href': imageUrl,
                  'type': 'image/png',
                  'rel': 'icon'
                }, <OwcLink>{
                  'href': overLay.geoserverURL + `?REQUEST=GetLegendGraphic&VERSION=1.0.0` +
                  `&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=${fullLayer}`,
                  'type': 'image/png',
                  'rel': 'icon'
                } ],
                data: [ {
                  'href': overLay.geoserverURL,
                  'type': 'application/xml',
                  'title': overLay.title + ':' + fullLayer
                } ],
                via: [ <OwcLink>{
                  'href': 'https://portal.smart-project.info/context/resource/' + res_uuid,
                  'rel': 'via'
                } ]
              },
              offerings: offeringsList,
              categories: [ viewCategory ],
              active: overLay.visible,
              folder: subCategorySpec.id,
            }
          };
          return myResource;
        });
        return owcResources;
      });
      let flattedResource: OwcResource[] = ([] as OwcResource[]).concat(...stackedResources);
      owcPrep.features = flattedResource;
      // console.log(JSON.stringify(owcPrep));
      return owcPrep;
    });

    /*
     website: ( https://portal.smart-project.info/geoserver/wfs )
Name: horowhenua_ws:soe_gwl_monitoring_wells
Description: OGC-Web Feature Service
Protocol: OGC:WFS
 website: ( https://portal.smart-project.info/geoserver/wfs?typename=horowhenua_ws%3Asoe_gwl_monitoring_wells
 &version=1.1.0&request=GetFeature&service=WFS )
Name: horowhenua_ws:soe_gwl_monitoring_wells
Description: File for download
Protocol: WWW:DOWNLOAD-1.0-http--download
    ( https://portal.smart-project.info/geoserver/ows )
Name: horowhenua_ws:soe_gwl_monitoring_wells
Description: OGC-Web Map Service
Protocol: OGC:WMS
 website: ( https://portal.smart-project.info/geoserver/ows?layers=horowhenua_ws%3Asoe_gwl_monitoring_wells
 &width=200&version=1.1.1 &bbox=175.18029442%2C-40.7122490012%2C175.358763319%2C-40.5296375112&service=WMS
 &format=image%2Fpng&styles=&srs=EPSG%3A4326&request=GetMap&height=200 )
     */

    return newContexts;
  }

}
