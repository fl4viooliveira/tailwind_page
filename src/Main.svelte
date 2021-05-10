<script>

  import Sidebar from "./Sidebar.svelte";

</script>

<div class='flex flex-row'>
  <div class='hidden w-64 lg:block'>
    <Sidebar />
  </div>
  <div class='flex flex-col w-full '>
    <h1 class='mx-auto text-3xl font-bold text-center font-Poppins leading-9 sm:text-5xl '>
      Put anything in your macOS menu bar
    </h1>
    <div class='flex flex-wrap pb-4 mt-10 xl:flex-nowrap sm:flex-wrap'>
      <div class='self-center w-full justify-self-center'>
        <ul class='w-auto text-2xl text-blue-900 font-Poppins'>
          <li class="items-center p-6 m-8 bg-white rounded-lg shadow-purple">
            <h2 class="motion-safe:hover:scale-110"> Hundreds of pre-built plugins to choose from </h2>
          </li>
          <li class="items-center p-6 m-8 bg-white rounded-lg shadow-purple">
            <h2> Information you care about, at a glance </h2>
          </li>
          <li class="items-center p-6 m-8 bg-white rounded-lg shadow-purple">
            <h2> Write your own plugins—in any language </h2>
          </li>
        </ul>
      </div>
      <div class='w-full mt-8'>
        <div class="flex items-center justify-center -mx-4 lg:pl-8">
          <div class="flex flex-col items-end px-3">
            <img
              class="object-cover mb-6 rounded shadow-purple h-28 sm:h-48 xl:h-56 w-28 sm:w-48 xl:w-56"
              src="./img/xbar-menu-preview.png" alt="xbar"/>
            <img class="object-cover w-20 h-20 rounded shadow-purple sm:h-32 xl:h-40 sm:w-32 xl:w-40"
            src="./img/xbar-website-preview.jpg" alt="xbar" />
          </div>
          <div class="px-3">
            <img class="object-cover w-40 h-40 rounded shadow-purple sm:h-64 xl:h-80 sm:w-64 xl:w-80"
            src="./img/xbar-menu-preview.png" alt="xbar" />
          </div>
        </div>
      </div>
    </div>
    <div class="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
      <div class="grid gap-8 lg:grid-cols-3 sm:max-w-sm sm:mx-auto lg:max-w-full">
        <div class="overflow-hidden bg-white rounded transition-shadow duration-300 shadow-purple">
          <img src="https://xbarapp.com/docs/plugins/Dev/Homebrew/brew-services.10m.rb.jpg" class="object-cover w-full h-64" alt="" />
          <div class="p-5 border border-t-0">
            <p class="mb-3 text-xs font-semibold tracking-wide uppercase">
              <a href="/" class="transition-colors duration-200 text-blue-gray-900 hover:text-deep-purple-accent-700">Dev</a>
              <span class="text-gray-600">— 28 Dec 2020</span>
            </p>
            <a href="/" class="inline-block mb-3 text-2xl font-bold leading-5 transition-colors duration-200 hover:text-deep-purple-accent-700">Brew Services</a>
            <p class="mb-2 text-gray-700">
              Sed ut perspiciatis unde omnis iste natus error sit sed quia consequuntur magni voluptatem doloremque.
            </p>
            <a href="/" class="inline-flex items-center font-semibold transition-colors duration-200 text-deep-purple-accent-400 hover:text-deep-purple-800">Learn more</a>
          </div>
        </div>
        <div class="overflow-hidden bg-white rounded transition-shadow duration-300 shadow-purple">
          <img src="https://xbarapp.com/docs/plugins/E-Commerce/Shopibar.15m.js.png" class="object-cover w-full h-64" alt="" />
          <div class="p-5 border border-t-0">
            <p class="mb-3 text-xs font-semibold tracking-wide uppercase">
              <a href="/" class="transition-colors duration-200 text-blue-gray-900 hover:text-deep-purple-accent-700">e-commerce</a>
              <span class="text-gray-600">— 28 Dec 2020</span>
            </p>
            <a href="/" class="inline-block mb-3 text-2xl font-bold leading-5 transition-colors duration-200 hover:text-deep-purple-accent-700">Shopibar</a>
            <p class="mb-2 text-gray-700">
              Sed ut perspiciatis unde omnis iste natus error sit sed quia consequuntur magni voluptatem doloremque.
            </p>
            <a href="/" class="inline-flex items-center font-semibold transition-colors duration-200 text-deep-purple-accent-400 hover:text-deep-purple-800">Learn more</a>
          </div>
        </div>
        <div class="overflow-hidden bg-white rounded transition-shadow duration-300 shadow-purple">
          <img src="https://xbarapp.com/docs/plugins/Science/people-in-space.6h.js.png" class="object-cover w-full h-64" alt="" />
          <div class="p-5 border border-t-0">
            <p class="mb-3 text-xs font-semibold tracking-wide uppercase">
              <a href="/" class="transition-colors duration-200 text-blue-gray-900 hover:text-deep-purple-accent-700">science</a>
              <span class="text-gray-600">— 28 Dec 2020</span>
            </p>
            <a href="/" class="inline-block mb-3 text-2xl font-bold leading-5 transition-colors duration-200 hover:text-deep-purple-accent-700">People In Space</a>
            <p class="mb-2 text-gray-700">
              Sed ut perspiciatis unde omnis iste natus error sit sed quia consequuntur magni voluptatem doloremque.
            </p>
            <a href="/" class="inline-flex items-center font-semibold transition-colors duration-200 text-deep-purple-accent-400 hover:text-deep-purple-800">Learn more</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
