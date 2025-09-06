import "@/assets/css/vendors/tabulator.css";
import Lucide from "@/components/Base/Lucide";
import { Menu } from "@/components/Base/Headless";
import { Slideover } from "@/components/Base/Headless";
import Button from "@/components/Base/Button";
import products from "@/fakers/products";
import {
  FormInline,
  FormInput,
  FormLabel,
  FormSelect,
} from "@/components/Base/Form";
import * as xlsx from "xlsx";
import { useEffect, useRef, createRef, useState } from "react";
import { createIcons, icons } from "lucide";
import { TabulatorFull as Tabulator } from "tabulator-tables";

import Can from "../PermissionChecker";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";


function Main({setShowCreateModal, show_create=true, endpoint, data, searchColumns, refetch, setRefetch, permission, page_name}) {
  const token = useSelector((state) => state.auth.token)
  const tenant = useSelector((state) => state.auth.tenant)
  const { t, i18n } = useTranslation();
  const tableRef = createRef();
  const tabulator = useRef();
  const [cardView, setCardView] = useState(false)
  const [filter, setFilter] = useState({
    field: searchColumns[0],
    type: "like",
    value: "",
  });

  const [filters, setFilters] = useState([ 
  ]);

  useState(()=>{
    setFilters(searchColumns.map((d)=>{
      return { field: d, type: "like", value: "" }   
    }));
  },[]);

  useEffect(()=>{
    if(refetch){
      initTabulator();
      setRefetch(false)
    }
  },[refetch])

  const updateFilter = (index, key, newValue) => {
    setFilters((prevFilters) => {
      const updatedFilters = [...prevFilters]; // Create a copy of the filters array
      updatedFilters[index] = { ...updatedFilters[index], [key]: newValue }; // Update specific filter
      return updatedFilters;
    });
  };

  const initTabulator = () => {
    if (tableRef.current) {
      tabulator.current = new Tabulator(tableRef.current, {
        ajaxURL: endpoint,
        paginationMode: "remote",
        filterMode: "remote",
        sortMode: "remote",
        printAsHtml: true,
        printStyled: true,
        pagination: true,
        paginationSize: 10,
        responsiveLayout: window.innerWidth < 768 ? "collapse": "",
        paginationSizeSelector: [10, 20, 30, 40, 100, 200],
        ajaxConfig: {
          headers: {
            'X-Tenant': `${tenant}`,
            'Authorization': `Bearer ${token}`
          }
        },
        ajaxResponse: function(url, params, response) {
          return {
            data: response.data.data,
            last_page:response.total_pages
          };
        },
        ajaxError: function(xhr, textStatus, errorThrown) {
          console.log('Ajax Load Error - Connection Error:', xhr.status, xhr.statusText);
          console.log('Data Load Error: ', xhr);
          if (xhr.status === 403) {
            console.error('Permission denied. Check if user has required permissions for this endpoint.');
          } else if (xhr.status === 401) {
            console.error('Authentication failed. Check if token is valid and not expired.');
          }
        },
        layout: "fitColumns",
        // responsiveLayout: "collapse",
        placeholder: t("No matching records found"),
        columns: window.innerWidth < 768 ? [ {
          title: "",
          formatter: "responsiveCollapse",
          width: 40,
          minWidth: 30,
          hozAlign: "center",
          resizable: false,
          headerSort: false,
        }, ...data] : data
      });
    }

    tabulator.current?.on("renderComplete", () => {
      createIcons({
        icons,
        attrs: {
          "stroke-width": 1.5,
        },
        nameAttr: "data-lucide",
      });
    });
  };

  // Redraw table onresize
  const reInitOnResizeWindow = () => {
    window.addEventListener("resize", () => {
      if (tabulator.current) {
        tabulator.current.redraw();
        createIcons({
          icons,
          attrs: {
            "stroke-width": 1.5,
          },
          nameAttr: "data-lucide",
        });
      }
    });
  };

  // Filter function
  const onFilter = () => {
    if (tabulator.current) {
      tabulator.current.setFilter(filter.field, filter.type, filter.value);
    }
  };

  const onMultipleFilter = () => {
    console.log('current filter', filters, filters.filter((d)=>{return d.value != ""}));
    setBasicSlideoverPreview(false);
    if (tabulator.current) {
      tabulator.current.setFilter(filters.filter((d)=>{return d.value != ""}));
    }
  };

  // On reset filter
  const onResetFilter = () => {
    setFilter({
      ...filter,
      field: searchColumns[0],
      type: "like",
      value: "",
    });
    onFilter();
  };

  // Export
  const onExportCsv = () => {
    if (tabulator.current) {
      tabulator.current.download("csv", "data.csv");
    }
  };

  const onExportJson = () => {
    if (tabulator.current) {
      tabulator.current.download("json", "data.json");
    }
  };

  const onExportXlsx = () => {
    if (tabulator.current) {
      window.XLSX = xlsx;
      tabulator.current.download("xlsx", "data.xlsx", {
        sheetName: "Data",
      });
    }
  };
 

  const onExportHtml = () => {
    if (tabulator.current) {
      tabulator.current.download("html", "data.html", {
        style: true,
      });
    }
  };

  // Print
  const onPrint = () => {
    if (tabulator.current) {
      tabulator.current.print();
    }
  };

  useEffect(() => {
    initTabulator();
    reInitOnResizeWindow();
  }, []);

  const [basicSlideoverPreview, setBasicSlideoverPreview] = useState(false);





  return (
    <div className="grid grid-cols-12 gap-y-10 gap-x-6">
      <div className="col-span-12">
      <div className="flex flex-col md:h-10 gap-y-3 md:items-center md:flex-row">
            <div className="text-base font-medium group-[.mode--light]:text-white">
              {t(page_name)}
            </div>
            <div className="flex flex-col sm:flex-row gap-x-3 gap-y-2 md:ml-auto">
              <div className="text-center">
                <Button
                  as="a"
                  href="#"
                  variant="primary"
                  onClick={(event) => {
                    event.preventDefault();
                    setBasicSlideoverPreview(true);
                  }}
                >
                  <Lucide icon="Filter" className="block mx-auto" />
                </Button>
              </div>
              <Slideover
              // size="xl"
                open={basicSlideoverPreview}
                onClose={() => {
                  setBasicSlideoverPreview(false);
                }}
              >
                <Slideover.Panel>
                  <Slideover.Title className="p-5">
                    <h2 className="mr-auto text-base font-medium">
                      {t("Filter Data")}
                    </h2>
                  </Slideover.Title>
                  <Slideover.Description>
                   <div className="w-full flex flex-col justify-start items-center gap-2">
                   {filters.map((d, index)=>(
                      <div className="w-full grid grid-cols-6 gap-2">
                            <FormInline className="col-span-2 flex-col items-start xl:flex-row xl:items-center gap-y-2">
                              <FormLabel className="mr-3 whitespace-nowrap">
                                {t(d.field)}
                              </FormLabel>
                            </FormInline>
                            <FormInline className="flex-col items-start xl:flex-row xl:items-center gap-y-2">
                              {/* <FormLabel className="mr-3 whitespace-nowrap">Type</FormLabel> */}
                              <FormSelect
                                id={`filter-value-${index}`}
                                value={d.type}
                                onChange={(e) => updateFilter(index, 'type', e.target.value)}
                                className=""
                              >
                                <option value="like">{t('like')}</option>
                                <option value="=">=</option>
                                <option value="<">&lt;</option>
                                <option value="<=">&lt;=</option>
                                <option value=">">&gt;</option>
                                <option value=">=">&gt;=</option>
                                <option value="!=">!=</option>
                              </FormSelect>
                            </FormInline>
                            <FormInline className=" col-span-3 flex-col items-start xl:flex-row xl:items-center gap-y-2">
                              <FormInput
                                id={`filter-value-${index}`}
                                value={d.value}
                                onChange={(e) => updateFilter(index, 'value', e.target.value)}
                                type="text"
                                className=""
                                placeholder={t('Search') + '....'}
                              />
                            </FormInline>
                      </div>
                   ))}
                    
                   </div>
                  </Slideover.Description>
                  <Slideover.Footer>
                      <Button variant="outline-secondary" type="button" onClick={()=> {
                          setBasicSlideoverPreview(false);
                          }}
                          className="w-32 mr-4"
                          >
                          {t("Cancel")}
                      </Button>
                      <Button onClick={()=>onMultipleFilter()} variant="primary" type="button" className="w-32">
                          {t("Filter Data")}
                      </Button>
                  </Slideover.Footer>
                </Slideover.Panel>
              </Slideover>
 
               <Can permission={`${permission.includes('-') ? permission : `${permission.toLowerCase()}-create`}`}>
                 {show_create &&  <Button
                   onClick={(event)=> {
                     event.preventDefault();
                     setShowCreateModal(true);
                     }}
                     variant="primary"
                     className="group-[.mode--light]:!bg-white/[0.12] group-[.mode--light]:!text-slate-200 group-[.mode--light]:!border-transparent dark:group-[.mode--light]:!bg-darkmode-900/30 dark:!box"
                   >
                   <Lucide icon="Plus" className="stroke-[1.3] w-4 h-4 mr-2" />{" "}
                   {t('Add New ')} {t(page_name)}
                 </Button>}
                
               </Can>
             </div>
           </div>
         <div className="flex flex-col gap-8 mt-3.5">
           <div className="flex flex-col box box--stacked">
             <div className="flex flex-col p-5 xl:items-center xl:flex-row gap-y-2">
              {/* <form
                id="tabulator-html-filter-form"
                className="flex xl:flex-row flex-col border-dashed gap-x-5 gap-y-2 border border-slate-300/80 xl:border-0 rounded-[0.6rem] p-4 sm:p-5 xl:p-0"
                onSubmit={(e) => {
                  e.preventDefault();
                  onFilter();
                }}
              >
                <FormInline className="flex-col items-start xl:flex-row xl:items-center gap-y-2">
                  <FormLabel className="mr-3 whitespace-nowrap">
                    {t("Search by")}
                  </FormLabel>
                  <FormSelect
                    id="tabulator-html-filter-field"
                    value={filter.field}
                    onChange={(e) => {
                      setFilter({
                        ...filter,
                        field: e.target.value,
                      });
                    }}
                    className=""
                  >
                    {searchColumns.map((d)=> <option value={d}>{t(d)}</option>)}
                  </FormSelect>
                </FormInline>
                <FormInline className="flex-col items-start xl:flex-row xl:items-center gap-y-2">
                  <FormLabel className="mr-3 whitespace-nowrap">{t("Type")}</FormLabel>
                  <FormSelect
                    id="tabulator-html-filter-type"
                    value={filter.type}
                    onChange={(e) => {
                      setFilter({
                        ...filter,
                        type: e.target.value,
                      });
                    }}
                    className=""
                  >
                    <option value="like">{t('like')}</option>
                    <option value="=">=</option>
                    <option value="<">&lt;</option>
                    <option value="<=">&lt;=</option>
                    <option value=">">&gt;</option>
                    <option value=">=">&gt;=</option>
                    <option value="!=">!=</option>
                  </FormSelect>
                </FormInline>
                <FormInline className="flex-col items-start xl:flex-row xl:items-center gap-y-2">
                  <FormLabel className="mr-3 whitespace-nowrap">
                    {t("Keywords")}
                  </FormLabel>
                  <FormInput
                    id="tabulator-html-filter-value"
                    value={filter.value}
                    onChange={(e) => {
                      setFilter({
                        ...filter,
                        value: e.target.value,
                      });
                    }}
                    type="text"
                    className=""
                    placeholder={t("Search...")}
                  />
                </FormInline>
                <div className="flex flex-col gap-2 mt-2 sm:flex-row xl:mt-0">
                  <Button
                    id="tabulator-html-filter-go"
                    variant="outline-primary"
                    type="button"
                    className="w-full sm:w-auto bg-primary/5 border-primary/20"
                    // onClick={onFilter}
                    onClick={onMultipleFilter}
                  >
                    {t("Search")}
                  </Button>
                  <Button
                    id="tabulator-html-filter-reset"
                    variant="outline-secondary"
                    type="button"
                    className="w-full sm:w-auto bg-slate-50/50 dark:bg-darkmode-400"
                    onClick={onResetFilter}
                  >
                    {t("Reset")}
                  </Button>
                </div>
              </form> */}
              <h1 className="font-bold text-xl">{t(page_name)}</h1>
              <div className="flex flex-col mt-3 sm:flex-row gap-x-3 gap-y-2 xl:ml-auto xl:mt-0">
              <Button variant="outline-secondary" onClick={() => onResetFilter()}>
                  <Lucide
                    icon="RefreshCcw"
                    className="stroke-[1.3] w-4 h-4 mr-2"
                  />
                  {t("Reset")}
                </Button>
                <Button type="button" variant="outline-secondary" onClick={onPrint}>
                  <Lucide
                    icon="Printer"
                    className="stroke-[1.3] w-4 h-4 mr-2"
                  />
                  {t("Print")}
                </Button>
                <Menu className="sm:ml-auto xl:ml-0">
                  <Menu.Button
                    as={Button}
                    variant="outline-secondary"
                    className="w-full sm:w-auto"
                  >
                    <Lucide
                      icon="FileCheck2"
                      className="stroke-[1.3] w-4 h-4 mr-2"
                    />
                    {t("Export")}
                    <Lucide
                      icon="ChevronDown"
                      className="stroke-[1.3] w-4 h-4 ml-2"
                    />
                  </Menu.Button>
                  <Menu.Items className="w-40">
                    <Menu.Item onClick={onExportCsv}>
                      <Lucide icon="FileCheck2" className="w-4 h-4 mr-2" />{" "}
                      {t("Export")} CSV
                    </Menu.Item>
                    <Menu.Item onClick={onExportJson}>
                      <Lucide icon="FileCheck2" className="w-4 h-4 mr-2" />
                      {t("Export")} JSON
                    </Menu.Item>
                    <Menu.Item onClick={onExportXlsx}>
                      <Lucide icon="FileCheck2" className="w-4 h-4 mr-2" />
                      {t("Export")} XLSX
                    </Menu.Item>
                    <Menu.Item onClick={onExportHtml}>
                      <Lucide icon="FileCheck2" className="w-4 h-4 mr-2" />
                      {t("Export")} HTML
                    </Menu.Item>
                  </Menu.Items>
                </Menu>
              </div>
            </div>
            {/* <div className="mx-3 my-4 btn btn-primary"><button onClick={()=>setCardView(!cardView)}>Toggle Card View</button></div> */}
            <div className="pb-5">
              <div className={`overflow-x-auto scrollbar-hidden ${cardView ? 'hidden' : ''}`} >
                <div id="tabulator"  ref={tableRef}></div>
                
                <div id="pagination"></div>
              </div>
              {cardView && <p>Card View here</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;
