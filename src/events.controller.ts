import { Controller, Delete, Get, Param, Patch, Post, Body, HttpCode } from "@nestjs/common";
import { CreateEventDto } from "./create-event.dto";
import { UpdateEventDto } from "./update-event.dto";

@Controller('/events')
export class EventsController {

    @Get()
    findAll() {
        return [
            { id: 1, name: 'First Event' },
            { id: 2, name: 'Second Event' },
        ]
    }

    @Get(':id')
    findOne(@Param('id') id) {
        return { id: 1, name: 'First Event' }
    }

    @Post()
    create(@Body() input: CreateEventDto) {

        return input
    }

    @Patch(':id')
    update(@Param('id') id, @Body() input: UpdateEventDto) { 

    }


    @Delete(':id')
    @HttpCode(204)
    remove(@Param('id') id) { 
        
    }
}
