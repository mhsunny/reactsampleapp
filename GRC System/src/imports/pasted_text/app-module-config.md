
Each card/tile box : each box like a widget and can be configurable 
  - Top right icons: sort, user, configure/setting, edit, delete, open icon to load the app
  - each tile can be drag to sort 
  - show the active modules as chips 
  - active / deactive 
  - when we click each card/tile when user will enter to

Here are group wise app list by default to show: 
Eevey individual app feature and functionality:
 - when user click the tile of any one or click the open icon then redirect or load the individual application. Make sure all individual application completely seperate functionality with seperate coebase or might different react codebase - but for now mapped in a such way so that we can configure later. 
 - The header bar style will be same as it is - but header text will be chagned liek this, Wells forgo logo - then app name - then GRC ecosystem.
    - for example:   Wells Fargo | Risk Inventory Management - GRC Ecosystem. Underneath Sloan can be changed to "A total solution of risk managment"
 - Individual application landing screen:
     - Show Sidebar bar and contert area.
     - sidebar:
        -  sidebar should not overleap to top header.
        - Side bar will have the some fixed moduels and addtional shared modules from the Plafrom Configurations 
      - Content area: 
       - top bar show the app nav tabs horizontally . You can display  recpecive icons wtih color with the shortAppName. I mean when user enter to the individual application then show a top bar (belwo to header) and dispaly like a navitaion tab to access of the other apps so that user can easily move to anoteher app and also can move to ERC Ecosytem main application list ladning page. 
        - Below the application nav bar show the breadcrumb so that user usersand the which screen they are in. 
            For example: GRC Ecosystem -> Risk Inventory Management -> Dashboard 
        - Below the breadcrumb show content area block 
        - Contnet area block: 
            - at top right side aligned, dispaly all the fixed and shared modules name like a chips/tabs/button show user can easisy which to different modules screen. Add "Dashborad" as first chip then add the modules to next.
        - Dashboard screen by default landing screen of the individual application.
        - Dashboard page : (cab be configure which modules to dispaly)
            - show some stats in top bar 
            - show 3-4 cards of fixed modules or shared modules (cab be configure the dashborad)
            - each card will have the modules name and info wtih with stats, counts , average, different chart 
            - if user clik the card then it allow to enter detail view of the that modules 
         - Each module/chip: will have CRUD functionality and other features. evert module like a page.
            - Show the grid with sort and filter as list view by default
            - Show list of all records with tile/list view features.  
            - Enavle pagination , show total count 
            - Every row should have edit and delete functionality 
            - SHow the icons, tile view, list view, downlaod, sort, column settings, Add new icon.
            - Quick fitlers and Advanced Filters sectiion 
            - Above the grid show the ions for global search bar, columns setting, fitler, Add, downlaod, and other features 
            - All grid must have CRUD, Add/Create, edit, update, delete functionaluty  
            

    Here the fixed modules diplay in as tabs/chips of some applications and what to display as fixed modiles in dashboard:

    App Name : Risk Inventory Management (chips )
    - Dashboard
        Cards :Mini char , line, pie, or other - each card chart will be differnt 
            Title: FRC Ownership Coverage
            Description:  % of business units with completed risk inventories 
            Stat Bar: some start   
            Charts :  chart will be here 

            Title:  Active Control Coverage
            Description: % of identified risks mapped to at least one control. 
        
            Stat Bar: some start   
            Charts :  chart will be here 

            Title: RAU Volume 
            Description:  % of business units with completed risk inventories 
            Charts :  chart will be here 

            Title:  MRE Volume
            Description: % of records reviewed within policy review cycle.
            Charts :  chart will be here 

            Title: Inventory Footprint
            Description:% of records passing mandatory field and taxonomy validation.
            Charts :  chart will be here 

            Title:  Control/FRC Ratio
            Description:Median daily manual control submissions vs required inventory entry.
            Charts :  chart will be here 

    - RAUs
    - Risks
    - Controls
    - MCRs
    - FRCs
    - Controls Library
    - MREs
    - Business Units
    - Policies


Configuration Capabilities group might be pre-requisites since we need some configuration. The shared modules will be managed from here.
 
 5. Configuration Capabilities : when we enter to the this app - then in the sidebar show the each items as parent item and underneath show some demo child items, show some child items as demo. like under User and Access Management might have permission, entitlement , etc and under Platform Configurations might have Modules, etc
- Workflow Designer
- User and Access Management
- Platform Configurations:
    - At the plafrom configuraion will have following features: 
        - Show the tabs top right : Dashboard | Modules | API Connectors | Chatbot MCP | MCP APIs | Email Notifications | Batch Jobs & Scheduling | Logging Levels | Form Feedback
        - Each Tab/chip has grid and crud functionality except Dashboard.
        
        - Dashboard : show some cards 4 grid (make sure the aboude grid show tile/list view icon)
                     -  API Connector connectiviuty, Batch job Readiness, Eoor Logging Coverage, Configurirable Object count, Bath job volume etc
                     -  Each card has stats and mini chart, downlaod icons, etc
        - Modules : - Must have CRUD functionality of modules 
                    - Show list of all modules with tile/list view features.  
                    - Every row should have edit and delete functionality 
                    - SHow the icons, tile view, list view, downlaod, sort, column settings, Add new icon.
                    - Quick fitlers and Advanced Filters sectiion 
                    - Module might have active/deactive 
                    - Module might be categories 
                    - Display the pre defined moddules can be shared to applications while creatting the new application:
                        - Integrated Surveillance Oversight Tool (ISOT)
                        - Case Manager System
                        - Arch. Lifecycle Status                        
                        - Surveillance Oversight & Monitoring (OHM)
                        - Multi-Source Data Ingestion
                        - Data Standardization & Normalization
                        - Data Definition & Lineage Mgmt.
                        - Data Authoring, Evaluation & Governance
                        - Rules Case & Workflow Orchestration
                        - Event Driven Documentation & Evidence
                        - Decision & Disclosure Assembly
                        - Reporting & Submission Integration
                        - External Submissions & Integration
                        - Access, Entitlements & Designation Management
                        - Regulatory & Policy Reference Management
                        - Auditability & Historical Records
                        - Compliance Hub
                        - Attestation
                        - Personal Trade Preclearance
                        - Enterprise Registration System
                        - Global Preclearance System
                        - Compliance Website 
                        - Compliance Supervisory Control System 
                        - Licensing Workflow 
                        - Reg Change 
                        - Reg Monitoring & Alerts Ingestions 
                        - Ristricted List Mgmt 
                        - Advertisement Reviews
                        - Reg Inventory Managment 
                        - Trade Surveillance Exception Detection 
                        - Surveillance Data Quality Control 
                        - Complaice Oversight Mangement 
                        - Employee Conduct, Conflict & Attestation Mgmt 




I will provide the other apps moduels and tab later, Now crete a awesome app with modern design style. Make sure will screen has demo data with CRUD functional to store. later I will point api and mongo db. Also provide me all the backed api endpoint so that i can create in my java sprint boot mongodb framework.
