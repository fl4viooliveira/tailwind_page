<script>

  import Top from './Top.svelte';
  import Main from './Main.svelte';
  import Footer from './Footer.svelte';

</script>

<style global lang="postcss">

  /* only apply purgecss on utilities, per Tailwind docs */
  /* purgecss start ignore */
  @tailwind base;
  @tailwind components;
  /* purgecss end ignore */

  @tailwind utilities;

  :global(body){
    /* background: #d3d3d373; */
    margin:0;
    padding:0;
  }
  :global(head){
    @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;1,300;1,400&display=swap');
  }
</style>

  <div class="container mx-auto">
    <Top />
    <Main />
    <Footer />
  </div>


