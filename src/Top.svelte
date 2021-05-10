<script>
  let active = false;
  import Sidebar from "./Sidebar.svelte";

</script>

<div class="px-4 py-5 mx-auto sm:max-w-xl md:max-w-full lg:max-w-full md:px-24 lg:px-8">
  <div class="relative flex items-center justify-between">
    <a href="/" aria-label="Company" title="Company" class="inline-flex items-center">
      <svg class="w-8 text-deep-purple-accent-400" viewBox="0 0 24 24" stroke-linejoin="round" stroke-width="2" stroke-linecap="round" stroke-miterlimit="10" stroke="currentColor" fill="none">
        <rect x="3" y="1" width="7" height="12"></rect>
        <rect x="3" y="17" width="7" height="6"></rect>
        <rect x="14" y="1" width="7" height="6"></rect>
        <rect x="14" y="11" width="7" height="12"></rect>
      </svg>
      <span class="ml-2 text-xl font-bold tracking-wide text-gray-800 uppercase mr-15">Company</span>
    </a>
    <img class="object-center w-12 h-12 mx-5 rounded-full" src="https://avatars.githubusercontent.com/u/101659?v=4" alt="Mat">
    <!-- Mobile menu -->
    <div class:active on:click={() => active= !active} class="lg:hidden">
      <button id="open" class="p-2 -mr-1 rounded transition duration-200 focus:outline-none focus:shadow-outline hover:bg-purple-50 focus:bg-deep-purple-50">
        <svg class="w-5 text-gray-600" viewBox="0 0 24 24">
          <path fill="currentColor" d="M23,13H1c-0.6,0-1-0.4-1-1s0.4-1,1-1h22c0.6,0,1,0.4,1,1S23.6,13,23,13z"></path>
          <path fill="currentColor" d="M23,6H1C0.4,6,0,5.6,0,5s0.4-1,1-1h22c0.6,0,1,0.4,1,1S23.6,6,23,6z"></path>
          <path fill="currentColor" d="M23,20H1c-0.6,0-1-0.4-1-1s0.4-1,1-1h22c0.6,0,1,0.4,1,1S23.6,20,23,20z"></path>
        </svg>
      </button>
      <button id="close" class="p-2 -mr-1 rounded transition duration-200 hover:bg-purple-50 focus:bg-gray-200 focus:outline-none focus:shadow-outline">
        <svg class="w-5 text-gray-600" viewBox="0 0 24 24">
          <path fill="currentColor"
            d="M19.7,4.3c-0.4-0.4-1-0.4-1.4,0L12,10.6L5.7,4.3c-0.4-0.4-1-0.4-1.4,0s-0.4,1,0,1.4l6.3,6.3l-6.3,6.3 
            c-0.4,0.4-0.4,1,0,1.4C4.5,19.9,4.7,20,5,20s0.5-0.1,0.7-0.3l6.3-6.3l6.3,6.3c0.2,0.2,0.5,0.3,0.7,0.3s0.5-0.1,0.7-0.3 
            c0.4-0.4,0.4-1,0-1.4L13.4,12l6.3-6.3C20.1,5.3,20.1,4.7,19.7,4.3z">
          </path>
        </svg>
      </button>
    </div>
  </div>
</div>
<div class="items-stretch side-bar md:items-center" class:active>
  <Sidebar />
</div>

<style>
  .side-bar{
    display: none;
  }
  #close{
    display: none;
  }
  .active{
    display: inline-table;
    width: 100%;
    text-align: right;    
  }
  .active #open{
    display: none;
  }
  .active #close{
    display: inline-table;
    text-align: right;
  }
</style>
